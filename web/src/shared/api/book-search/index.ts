import * as tor from '../tor-request'
import type { BookItem, ProviderType } from '../types'
import type { SearchConfig } from './types'
import { FLIBUSTA, FLIBUSTA_TOR, ZLIB } from './configs'
import { ZLIB_COOKIE } from '../login'

const providers = <const>{ FLIBUSTA, FLIBUSTA_TOR, ZLIB }

export async function bookSearch(type: ProviderType, name: string, extension: string): Promise<BookItem[]> {
  const config = providers[type] || FLIBUSTA
  const query: Record<string, string | string[]> = { ...config.query, extensions: [extension] }
  const headers: Record<string, string> = {}
  let path = config.path

  if (config.searchParam) {
    query[config.searchParam] = name
  } else {
    path += name
  }

  if (config.includeCookie) {
    query.cookie = localStorage.getItem(ZLIB_COOKIE) || ''
  }

  const body = await tor.request<string>(config.host, path, { query, headers })

  return parseSearch(body, config)
}

function parseSearch(body: string, config: SearchConfig): BookItem[] {
  const doc = new DOMParser().parseFromString(body, 'text/html')
  const entries = doc.querySelectorAll<HTMLElement>(config.selectors.entry)

  const books: any[] = Array.prototype.map
    .call(entries, (entry: HTMLElement) => {
      const link = config.selectors.link(entry)

      if (!link) return

      const data: any = { type: config.type, link }

      for (const key in config.selectors.fields) {
        const value = (config.selectors.fields as any)[key](entry)

        if (value) {
          data[key] = value
        }
      }

      return data
    })
    .filter(i => i)

  return books
}
