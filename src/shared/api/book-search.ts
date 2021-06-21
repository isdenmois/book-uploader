import cheerio from 'react-native-cheerio'
import { FLIBUSTA_HOST, ZLIB_HOST } from '@env'
import AsyncStorage from '@react-native-community/async-storage'
import * as tor from './tor-request'
import { ZLIB_COOKIE } from './login'
import { BookItem, ProviderType, SearchConfig, SearchSelectors } from './types'

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
}

const zlib: SearchConfig = {
  host: ZLIB_HOST,
  path: '/s/',
  query: { e: 1, extension: 'epub' },
  includeCookie: ZLIB_COOKIE,
  selectors: {
    entry: '#searchResultBox .resItemBox',
    author: '.authors a',
    ext: zExtension,
    link: 'h3[itemprop="name"] a',
    title: 'h3[itemprop="name"] a',
    lang: replaceSelector('.property_language', 'Language:'),
    size: zSize,
  },
}

const providers = <const>{ flibusta, zlib }

export async function bookSearch(type: ProviderType, name: string, extension: string): Promise<BookItem[]> {
  const config = providers[type] || flibusta
  const query: Record<string, string> = { ...config.query, extension }
  const headers: Record<string, string> = {}
  let path = config.path

  if (config.searchParam) {
    query[config.searchParam] = name
  } else {
    path += name
  }

  if (config.includeCookie) {
    headers.Cookie = await AsyncStorage.getItem(config.includeCookie)
  }

  const body = await tor.request<string>(config.host, path, { query, headers })

  return parseSearch(body, type, config.selectors)
}

function parseSearch(body: string, type: ProviderType, selectors: SearchSelectors): BookItem[] {
  const $ = cheerio.load(body)
  const { entry: entrySelector, ext, link: linkSelector, author: authorSelector, ...others } = selectors

  const books = $(entrySelector).map((ekey, entry) => {
    entry = $(entry)
    const data: BookItem = {
      link: entry.find(linkSelector).attr('href'),
      ext: typeof ext === 'function' ? ext(entry) : ext,
      type,
    }
    if (!data.link) return null

    const authors = entry.find(authorSelector)

    if (authors.length > 1) {
      data.authors = authors
        .map((i, a) => $(a).text())
        .get()
        .join('; ')
    } else {
      data.authors = authors.text()
    }

    for (let key in others) {
      const value = typeof others[key] === 'function' ? others[key](entry) : find(entry, others[key])

      if (value) {
        data[key] = value
      }
    }

    return data
  })

  return books.get().filter(n => n?.link)
}

function regExpSelector(selector: string, regExp: RegExp) {
  return function (entry): string {
    const node = entry.find(selector)

    return node?.text().match(regExp)?.[1]
  }
}

function replaceSelector(selector: string, toReplace: string) {
  return function (entry): string {
    const node = entry.find(selector)

    return node?.text().replace(toReplace, '').trim()
  }
}

function find(entry, selector: string): string {
  return entry.find(selector).text().trim()
}

const FILE_SELECTOR = '.property__file .property_value'

function zExtension(entry): string {
  const node = entry.find(FILE_SELECTOR)

  return node?.text().replace(/,.*/, '').trim().toLowerCase()
}

function zSize(entry): string {
  const node = entry.find(FILE_SELECTOR)

  return node?.text().replace(/.*,/, '').trim()
}
