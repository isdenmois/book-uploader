import cheerio from 'react-native-cheerio';
import { FLIBUSTA_HOST, ZLIB_HOST } from '@env';
import AsyncStorage from '@react-native-community/async-storage';
import { torRequest } from './tor-request';
import { ZLIB_COOKIE } from './login';

interface SearchConfig {
  host: string;
  path: string;
  query: Record<string, any>;
  searchParam?: string;
  includeCookie?: string;
  selectors: {
    entry: string;
    link: string;
    author: string;
    ext: string;
  } & Record<string, string | Function>;
}

const flibusta: SearchConfig = {
  host: FLIBUSTA_HOST,
  path: '/opds/search',
  query: { searchType: 'books' },
  searchParam: 'searchTerm',
  selectors: {
    entry: 'entry',
    author: 'author name',
    ext: 'fb2.zip',
    link: 'link[href$="fb2"]',
    title: 'title',
    translation: regExpSelector('content', /перевод:\s?(.+?)\s?[&<]/i),
    lang: regExpSelector('content', /язык:\s?(.+?)\s?[&<]/i),
    size: regExpSelector('content', /размер:\s?(.+?)\s?[&<]/i),
  },
};

const zlib: SearchConfig = {
  host: ZLIB_HOST,
  path: '/s/',
  query: { e: 1, language: '', extension: 'epub' },
  includeCookie: ZLIB_COOKIE,
  selectors: {
    entry: '#searchResultBox .resItemBox',
    author: '.authors a',
    ext: 'epub',
    link: 'h3[itemprop="name"] a',
    title: 'h3[itemprop="name"] a',
    lang: replaceSelector('.property_language', 'Language:'),
    size: replaceSelector('.property__file .property_value', 'EPUB, '),
  },
};

const providers = <const>{ flibusta, zlib };

export type PROVIDER_TYPE = keyof typeof providers;

export async function bookSearch(type: PROVIDER_TYPE, name: string) {
  const config = providers[type] || flibusta;
  const query: Record<string, string> = { ...config.query };
  const headers: Record<string, string> = {};
  let path = config.path;

  if (config.searchParam) {
    query[config.searchParam] = name;
  } else {
    path += name;
  }

  if (config.includeCookie) {
    headers.Cookie = await AsyncStorage.getItem(config.includeCookie);
  }

  try {
    const body = await torRequest<string>(config.host, path, { query, headers });

    return { data: parseSearch(body, type, config.selectors) };
  } catch (e) {
    return { error: (e && e.message) || e };
  }
}

function parseSearch(body: string, type: PROVIDER_TYPE, selectors) {
  const $ = cheerio.load(body);
  const { entry: entrySelector, ext, link: linkSelector, author: authorSelector, ...others } = selectors;

  const books = $(entrySelector).map((ekey, entry) => {
    entry = $(entry);
    const data: Record<string, string> = {
      link: entry.find(linkSelector).attr('href'),
      ext,
      type,
    };
    if (!data.link) return null;

    const authors = entry.find(authorSelector);

    if (authors.length > 1) {
      data.authors = authors
        .map((i, a) => $(a).text())
        .get()
        .join('; ');
    } else {
      data.authors = authors.text();
    }

    for (let key in others) {
      const value = typeof others[key] === 'function' ? others[key](entry) : find(entry, others[key]);

      if (value) {
        data[key] = value;
      }
    }

    return data;
  });

  return books.get().filter(n => n?.link);
}

function regExpSelector(selector: string, regExp: RegExp) {
  return function (entry): string {
    const node = entry.find(selector);

    return node?.text().match(regExp)?.[1];
  };
}

function replaceSelector(selector: string, toReplace: string) {
  return function (entry): string {
    const node = entry.find(selector);

    return node?.text().replace(toReplace, '').trim();
  };
}

function find(entry, selector: string): string {
  return entry.find(selector).text().trim();
}
