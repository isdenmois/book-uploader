import * as tor from '../tor-request'
import type { BookItem, ProviderType } from '../types'
import type { SearchConfig } from './types'
import { FLIBUSTA, ZLIB } from './configs'
import { ZLIB_COOKIE } from '../login'

const providers = <const>{ FLIBUSTA, ZLIB }

export async function bookSearch(type: ProviderType, name: string, extension: string): Promise<BookItem[]> {
  const config = providers[type] || FLIBUSTA
  const query: Record<string, string> = { ...config.query, extension }
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

const parser = new DOMParser()

function parseSearch(body: string, config: SearchConfig): BookItem[] {
  const doc = parser.parseFromString(body, 'text/html')
  const entries = doc.querySelectorAll<HTMLElement>(config.selectors.entry)

  const books: any[] = Array.prototype.map
    .call(entries, (entry: HTMLElement) => {
      const link = config.selectors.link(entry)

      if (!link) return

      const data: any = { type: config.type, link }

      for (const key in config.selectors.fields) {
        data[key] = (config.selectors.fields as any)[key](entry)
      }

      return data
    })
    .filter(i => i)

  return books
}
