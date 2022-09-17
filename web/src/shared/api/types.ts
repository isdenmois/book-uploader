export type ProviderType = 'ZLIB' | 'FLIBUSTA' | 'FLIBUSTA_TOR'

export interface SearchSelectors extends Record<string, string | Function> {
  entry: string
  link: string
  author: string
  ext: string | ((entry: any) => string)
}

export interface SearchConfig {
  host: string
  path: string
  query: Record<string, any>
  searchParam?: string
  includeCookie?: boolean
  selectors: SearchSelectors
}

export interface BookItem {
  type: ProviderType
  link: string
  title: string
  ext: string
  authors?: string
  translation?: string
  lang?: string
  size?: string
}
