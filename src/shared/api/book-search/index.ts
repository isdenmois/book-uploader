import cheerio from 'react-native-cheerio'
import { MMKV } from 'shared/libs'

import * as tor from '../tor-request'
import type { BookItem, ProviderType } from '../types'
import type { SearchConfig } from './types'
import { FLIBUSTA, ZLIB } from './configs'
import { API_CONFIG } from '../config'
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
    query.cookie = MMKV.getString(ZLIB_COOKIE) || ''
  }

  const body = await tor.request<string>(API_CONFIG[config.host], path, { query, headers })

  return parseSearch(body, config)
}

function parseSearch(body: string, config: SearchConfig): BookItem[] {
  const $ = cheerio.load(body)

  const books: any[] = $(config.selectors.entry)
    .map((_, entry) => {
      entry = $(entry)

      try {
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
      } catch {}
    })
    .filter(i => i)

  return books
}
