import { createEffect } from 'effector'
import { bookSearch, ProviderType } from 'shared/api'
import { setExtension, setQuery, setType } from './events'
import { $booksFound, $query, $searchFilters } from './stores'

type FetchBookParams = {
  type: ProviderType
  query: string
  extension?: string
}

export const fetchBookItemsFx = createEffect(({ type, query, extension }: FetchBookParams) =>
  bookSearch(type, query, extension),
)

$searchFilters.on(setType, (_, type) => ({ type, extension: 'epub' }))
$searchFilters.on(setExtension, ({ type }, extension) => ({ type, extension }))

$query.on(setQuery, (_, query) => query)

$booksFound.on(fetchBookItemsFx.doneData, (_, books) => books)
$booksFound.on(setType, () => null)
$booksFound.on(setExtension, () => null)
$booksFound.on(setQuery, () => null)
