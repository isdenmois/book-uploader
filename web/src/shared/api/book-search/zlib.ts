import * as tor from '../tor-request'
import { API_CONFIG } from '../config'
import { BookItem, ProviderType } from '../types'
import { FLIBUSTA, FLIBUSTA_TOR } from './configs'
import { SearchConfig } from './types'
import { ZLIB_COOKIE } from '../login'
import { querystring } from '../utils'

const zlibHost = API_CONFIG.ZLIB_HOST

interface ZlibSearchResponse {
  books: Array<{
    id: string
    title: string
    author: string
    year: string
    language: string
    extension: string
    filesize: string
    cover: string
    terms_hash: string
    active: string
    deleted: number
    filesizeString: string
    href: string
    hash: string
    description: string
    kindleAvailable: boolean
    sendToEmailAvailable: boolean
    dl: string
  }>
  success: number
}

export async function searchZlib(name: string, extension: string): Promise<BookItem[]> {
  const body = await tor.request<ZlibSearchResponse>(API_CONFIG.ZLIB_HOST, '/eapi/book/search', {
    method: 'POST',
    query: {
      cookie: localStorage.getItem(ZLIB_COOKIE) || '',
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: querystring({
      extensions: extension,
      message: name,
      limit: 50,
      order: 'popular',
    }),
  })

  return body.books.map(
    book =>
      ({
        type: 'ZLIB',
        ext: extension,
        link: `${book.id}/${book.hash}`,
        title: book.title,
        authors: book.author,
        lang: book.language,
        size: book.filesizeString,
      } as BookItem),
  )
}

function parseSearch(body: string): BookItem[] {
  const items = JSON.parse(body)

  return []
}
