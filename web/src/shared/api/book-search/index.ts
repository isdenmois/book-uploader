import * as tor from '../tor-request'
import type { BookItem, ProviderType } from '../types'
import type { SearchConfig } from './types'
import { FLIBUSTA, FLIBUSTA_TOR } from './configs'
import { ZLIB_COOKIE } from '../login'
import { searchFlibusta } from './flibusta'
import { searchZlib } from './zlib'

export async function bookSearch(type: ProviderType, name: string, extension: string): Promise<BookItem[]> {
  if (type === 'ZLIB') {
    return searchZlib(name, extension)
  }

  return searchFlibusta(type, name, extension)
}
