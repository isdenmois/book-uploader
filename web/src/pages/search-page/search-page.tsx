import { Component, For, Show } from 'solid-js'

import { api } from 'shared/api'
import { useSignal } from 'shared/lib/solid-nanostore'
import { $books, $isLoading } from 'features/search'

import { SearchFilters } from 'features/filters'
import { BookItem } from 'entities/book'
import { Spinner } from 'shared/ui'

import { startSearch } from './search-model'

export const SearchPage: Component = () => {
  const books = useSignal($books)
  const isLoading = useSignal($isLoading)

  return (
    <div className='pt-4 flex flex-col flex-1 overflow-hidden'>
      <SearchFilters disabled={isLoading()} onSearch={startSearch} />

      <Show when={isLoading()}>
        <Spinner />
      </Show>

      <Show when={books()?.length}>
        <div className='book-list flex-1 p-2 overflow-y-auto'>
          <For each={books()}>{book => <BookItem book={book} onDownload={() => api.downloadFile(book)} />}</For>
        </div>
      </Show>
    </div>
  )
}
