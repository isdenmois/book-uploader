import { extAtom, queryAtom, sourceAtom } from 'features/filters'
import { $books, searchBooks } from 'features/search'
import { onSet, onStart } from 'nanostores'
import type { Extenstion, Source } from 'shared/types'

export const startSearch = () => {
  const ext = extAtom.get()
  const query = queryAtom.get()
  const source = sourceAtom.get()

  searchBooks(source, query, ext)

  if (history.replaceState) {
    const url = `${location.protocol}//${location.host}${location.pathname}?q=${query}&ext=${ext}&source=${source}`
    history.replaceState({ path: url }, '', url)
  }
}

const clearBooks = () => {
  $books.set(null)
}

onSet(extAtom, clearBooks)
onSet(queryAtom, clearBooks)
onSet(sourceAtom, clearBooks)

onStart($books, () => {
  const params = new URLSearchParams(location.search)
  const q = params.get('q')

  if (q) {
    sourceAtom.set((params.get('source') as Source) || 'FLIBUSTA')
    queryAtom.set(q)
    extAtom.set((params.get('ext') as Extenstion) || 'epub')

    startSearch()
  }
})
