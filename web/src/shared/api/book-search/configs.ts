import { cutSelector, linkSelector, listTextSelector, matchSelector, textSelector, value } from './selectors'
import { SearchConfig } from './types'

export const FLIBUSTA: SearchConfig = {
  type: 'FLIBUSTA',
  host: import.meta.env?.VITE_FLIBUSTA_HOST,
  path: '/opds/search',
  query: { searchType: 'books' },
  searchParam: 'searchTerm',
  selectors: {
    entry: 'entry',
    link: linkSelector('link[href$="fb2"]'),
    fields: {
      authors: listTextSelector('author name'),
      ext: value('fb2.zip'),
      title: textSelector('title'),
      translation: matchSelector('content', new RegExp(/Перевод:\s?(.+?)\s?[&<]/)),
      lang: matchSelector('content', new RegExp(/Язык:\s?(.+?)\s?[&<]/)),
      size: matchSelector('content', new RegExp(/Размер:\s?(.+?)\s?[&<]/)),
    },
  },
}

export const ZLIB: SearchConfig = {
  type: 'ZLIB',
  host: import.meta.env?.VITE_ZLIB_HOST,
  path: '/s/',
  query: { e: 1, extension: 'epub' },
  includeCookie: true,
  selectors: {
    entry: '#searchResultBox .resItemBox',
    link: linkSelector('h3[itemprop="name"] a'),
    fields: {
      authors: listTextSelector('.authors a'),
      ext: cutSelector('.property__file .property_value', /,.*/),
      title: textSelector('h3[itemprop="name"] a'),
      lang: cutSelector('.property_language', 'Language:'),
      size: cutSelector('.property__file .property_value', /.*,/),
    } as any,
  },
}
