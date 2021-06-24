import { createEffect } from 'effector'

import { api, ProviderType } from 'shared/api'
import { $searchFilters } from 'entities/search-filters'

import { $booksFound } from './stores'

type FetchBookParams = {
  type: ProviderType
  query: string
  extension?: string
}

export const fetchBookItemsFx = createEffect(({ type, query, extension }: FetchBookParams) =>
  api.bookSearch(type, query, extension),
)

$booksFound.on(fetchBookItemsFx.doneData, (_, books) => books)
$booksFound.on($searchFilters, () => null)
