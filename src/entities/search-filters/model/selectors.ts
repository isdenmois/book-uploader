import { $searchFilters } from './stores'

export const $query = $searchFilters.map(state => state.query)
