import { createStore } from 'effector'
import { SearchFiltersState } from './types'

/**
 * Search query filters
 */
export const $searchFilters = createStore<SearchFiltersState>({ type: 'zlib', extension: 'epub', query: '' })
