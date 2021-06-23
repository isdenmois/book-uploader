import { setExtension, setQuery, setType } from './events'
import { $searchFilters } from './stores'

$searchFilters.on(setType, ({ query }, type) => ({ query, type, extension: 'epub' }))
$searchFilters.on(setExtension, (state, extension) => ({ ...state, extension }))
$searchFilters.on(setQuery, (state, query) => ({ ...state, query }))
