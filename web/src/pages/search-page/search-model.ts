import { onSet, onStart } from 'nanostores'
import { $ext, $query, $source } from 'features/filters'
import { $books, searchBooks } from 'features/search'
import type { Extenstion, Source } from 'shared/types'

export const startSearch = () => {
  const ext = $ext.get()
  const query = $query.get()
  const source = $source.get()

  searchBooks(source, query, ext)

  if (history.replaceState) {
    const url = `${location.protocol}//${location.host}${location.pathname}?q=${query}&ext=${ext}&source=${source}`
    history.replaceState({ path: url }, '', url)
  }
}

const clearBooks = () => {
  $books.set(null)
}

onSet($ext, clearBooks)
onSet($query, clearBooks)
onSet($source, clearBooks)

onStart($books, () => {
  const params = new URLSearchParams(location.search)
  const q = params.get('q')

  if (q) {
    $source.set((params.get('source') as Source) || 'FLIBUSTA')
    $query.set(q)
    $ext.set((params.get('ext') as Extenstion) || 'epub')

    startSearch()
  }
})
