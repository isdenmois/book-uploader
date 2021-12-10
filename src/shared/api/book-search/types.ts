import { BookItem, ProviderType } from '../types'

export type SearchSelector = (entry: any) => any

export interface SearchConfig {
  type: ProviderType
  host: string
  path: string
  query: Record<string, any>
  searchParam?: string
  includeCookie?: boolean
  selectors: {
    entry: string
    link: SearchSelector
    fields: Record<keyof Omit<BookItem, 'type' | 'link'>, SearchSelector>
  }
}
