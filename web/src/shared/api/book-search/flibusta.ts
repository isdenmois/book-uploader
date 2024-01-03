import * as tor from '../tor-request'
import { BookItem, ProviderType } from '../types'
import { FLIBUSTA, FLIBUSTA_TOR } from './configs'
import { SearchConfig } from './types'

const providers = <const>{ FLIBUSTA, FLIBUSTA_TOR }

export async function searchFlibusta(
  type: keyof typeof providers,
  name: string,
  extension: string,
): Promise<BookItem[]> {
  const config = type in providers ? providers[type] : FLIBUSTA
  const query: Record<string, string | string[]> = { ...config.query, extensions: [extension] }
  const headers: Record<string, string> = {}
  let path = config.path

  if (config.searchParam) {
    query[config.searchParam] = name
  } else {
    path += name
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
