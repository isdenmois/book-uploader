import cheerio from 'react-native-cheerio';
import { FLIBUSTA_HOST, ZLIB_HOST, USER_AGENT } from '@env';
import AsyncStorage from '@react-native-community/async-storage';

const flibusta = {
  host: FLIBUSTA_HOST,
  useProxy: true,
  search: {
    path: '/api/rewrite',
    params: { path: '/opds/search', searchType: 'books' },
    query: {
      type: 'query',
      name: 'searchTerm',
    },
  },
  selectors: {
    entry: 'entry',
    link: 'link[href$="fb2"]',
    title: 'title',
    author: 'author name',
    translation: {
      selector: 'content',
      regexp: 'Перевод:\\s?(.+?)\\s?[&<]',
    },
    lang: {
      selector: 'content',
      regexp: 'Язык:\\s?(.+?)\\s?[&<]',
    },
    size: {
      selector: 'content',
      regexp: 'Размер:\\s?(.+?)\\s?[&<]',
    },
    ext: 'fb2.zip',
  },
};

const zlib = {
  host: FLIBUSTA_HOST,
  search: {
    path: '/api/rewrite',
    params: { host: ZLIB_HOST, path: '/s/{{name}}/', e: 1, language: '', extension: 'epub' },
    query: {},
  },
  includeCookies: 'zlibauth',
  selectors: {
    entry: '#searchResultBox .resItemBox',
    link: 'h3[itemprop="name"] a',
    title: 'h3[itemprop="name"] a',
    author: '.authors a',
    lang: {
      selector: '.property_language',
      replace: 'Language:',
    },
    size: {
      selector: '.property__file .property_value',
      replace: 'EPUB, ',
    },
    ext: 'epub',
  },
};

function flibustaFileUrl(link) {
  return { url: `${FLIBUSTA_HOST}/api/rewrite?path=${encodeURIComponent(link)}`, headers: {} };
}

async function zlibFileUrl(link) {
  console.log('link', link);
  const h = { ...headers };
  h.Cookie = await AsyncStorage.getItem(zlib.includeCookies);

  const body = await fetch(`${FLIBUSTA_HOST}/api/rewrite?host=${ZLIB_HOST}&path=${link}`, { headers: h }).then(r =>
    r.text(),
  );
  console.log('body', body);
  const $ = cheerio.load(body);

  const url = `${FLIBUSTA_HOST}/api/rewrite?host=${ZLIB_HOST}&path=${$(`a.addDownloadedBook`).attr(
    'href',
  )}&nofollow=true`;
  h.referer = `http://${ZLIB_HOST}${link}`;
  h.origin = `http://${ZLIB_HOST}${link}`;

  console.log('url', url);
  return { url, headers: h };
}

export function fileUrl(type, link) {
  if (type === 'zlib') {
    return zlibFileUrl(link);
  }

  return flibustaFileUrl(link);
}

const providers = {
  flibusta,
  zlib,
};

function querystring(query = {}) {
  // get array of key value pairs ([[k1, v1], [k2, v2]])
  const qs = Object.entries(query)
    // filter pairs with undefined value
    .filter(pair => pair[1] !== undefined)
    // encode keys and values, remove the value if it is null, but leave the key
    .map(pair =>
      pair
        .filter(i => i !== null)
        .map(encodeURIComponent)
        .join('='),
    )
    .join('&');

  return qs && '?' + qs;
}

function toUrlForm(data) {
  const formBody = [];

  for (let property in data) {
    const encodedKey = encodeURIComponent(property);
    const encodedValue = encodeURIComponent(data[property]);

    formBody.push(encodedKey + '=' + encodedValue);
  }

  return formBody.join('&');
}

function parseSearch(body, selectors) {
  const $ = cheerio.load(body);
  const translation = selectors.translation && new RegExp(selectors.translation.regexp, 'i');

  const books = $(selectors.entry).map((key, entry) => {
    entry = $(entry);
    const data = {
      title: entry.find(selectors.title).text(),
      link: entry.find(selectors.link).attr('href'),
      ext: selectors.ext,
    };

    const authors = $(entry).find(selectors.author);

    if (authors.length > 1) {
      data.authors = authors
        .map((i, a) => $(a).text())
        .get()
        .join('; ');
    } else {
      data.authors = authors.text();
    }

    if (translation) {
      data.translation = entry.find(selectors.translation.selector).text()?.match(translation)?.[1];
    }
    const lang = entry.find(selectors.lang.selector);

    if (selectors.lang.regexp) {
      data.lang = lang.text()?.match(selectors.lang.regexp)?.[1];
    } else {
      data.lang = lang.text().replace(selectors.lang.replace, '').trim();
    }

    const size = entry.find(selectors.size.selector);

    if (selectors.size.regexp) {
      data.size = size.text()?.match(selectors.size.regexp)?.[1];
    } else {
      data.size = size.text().replace(selectors.size.replace, '').trim();
    }

    return data;
  });

  return books.get();
}

const headers = {
  'User-Agent': USER_AGENT,
};

export async function searchHandler(type, name) {
  const config = providers[type] || flibusta;

  const search = config.search;

  let url = config.host + search.path;

  const params = { ...search.params };

  if (search.query.type === 'query') {
    params[search.query.name] = name;
  } else {
    params.path = params.path.replace('{{name}}', name);
  }

  if (config.includeCookies) {
    headers.Cookie = await AsyncStorage.getItem(config.includeCookies);
  }

  console.log(headers);
  url = url + querystring(params);

  try {
    const response = await fetch(url, { headers, params, proxy: process.env.HTTPS_PROXY });
    const body = await response.text();

    return { data: parseSearch(body, config.selectors, config.fileUrl) };
  } catch (e) {
    return { error: (e && e.message) || e };
  }
}

export function sendLogin(email, password) {
  const data = { email, password, action: 'login' };
  const body = toUrlForm(data);

  const params = { host: ZLIB_HOST, path: '/rpc.php' };
  const url = FLIBUSTA_HOST + '/api/rewrite' + querystring(params);
  console.log('url', url);

  return fetch(url, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  })
    .then(response => response.text())
    .then(t => t.match(/onion\/\?(.*?)"/)?.[1] || '')
    .then(cookie => cookie.replace('&', '; '))
    .catch(err => {
      console.log(err);
    });
}
