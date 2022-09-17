import { API_CONFIG } from '../config'
import { cutSelector, propertySelector, listTextSelector, matchSelector, textSelector, value } from './selectors'
import { SearchConfig } from './types'

export const FLIBUSTA: SearchConfig = {
  type: 'FLIBUSTA',
  host: API_CONFIG.FLIBUSTA_HOST,
  path: '/opds/search',
  query: { searchType: 'books', noproxy: true },
  searchParam: 'searchTerm',
  selectors: {
    entry: 'entry',
    link: propertySelector('link[href$="fb2"]', 'href'),
    fields: {
      authors: listTextSelector('author name'),
      ext: value('fb2.zip'),
      title: textSelector('title'),
      translation: matchSelector('content', new RegExp(/Перевод:\s?(.+?)\s*[&<]/)),
      lang: matchSelector('content', new RegExp(/Язык:\s?(.+?)\s*[&<]/)),
      size: matchSelector('content', new RegExp(/Размер:\s?(.+?)\s*[&<]/)),
    },
  },
}

export const FLIBUSTA_TOR = {
  ...FLIBUSTA,
  type: 'FLIBUSTA_TOR',
  host: API_CONFIG.FLIBUSTA_HOST_TOR,
  query: { searchType: 'books' },
}

export const ZLIB: SearchConfig = {
  type: 'ZLIB',
  host: API_CONFIG.ZLIB_HOST,
  path: '/s/',
  query: { e: 1, extensions: ['epub'] },
  includeCookie: true,
  selectors: {
    entry: '#searchResultBox .resItemBox',
    link: propertySelector('h3[itemprop="name"] a', 'href'),
    fields: {
      authors: listTextSelector('.authors a'),
      ext: cutSelector('.property__file .property_value', /,.*/),
      title: textSelector('h3[itemprop="name"] a'),
      lang: cutSelector('.property_language', 'Language:'),
      size: cutSelector('.property__file .property_value', /.*,/),
    } as any,
  },
}
