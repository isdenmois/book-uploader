import { createStore } from 'effector'
import { BookItem } from 'shared/api'
import { SearchFiltersState } from './types'

export const $query = createStore('')

export const $searchFilters = createStore<SearchFiltersState>({ type: 'zlib', extension: 'epub' })

export const $booksFound = createStore<BookItem[] | null>(null)
