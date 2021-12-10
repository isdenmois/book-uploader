import { createStore } from 'effector'
import { SearchFiltersState } from './types'

/**
 * Search query filters
 */
export const $searchFilters = createStore<SearchFiltersState>({ type: 'ZLIB', extension: 'epub', query: '' })
