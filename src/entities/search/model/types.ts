export type SearchType = 'zlib' | 'flibusta'
export type Extension = 'epub' | 'fb2'

export type SearchFiltersState = {
  type: SearchType
  extension: Extension
}
