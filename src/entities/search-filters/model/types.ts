import { ProviderType } from 'shared/api'

export type Extension = 'epub' | 'fb2'

export type SearchFiltersState = {
  type: ProviderType
  extension: Extension
  query: string
}
