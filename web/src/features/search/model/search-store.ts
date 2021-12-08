import { atom } from 'nanostores'
import { api, ProviderType } from 'shared/api'
import type { BookItem } from 'shared/api'
import type { Extenstion } from 'shared/types'

export const $isLoading = atom(false)
export const $books = atom<BookItem[] | null>([])

export const searchBooks = async (type: ProviderType, query: string, ext: Extenstion = 'fb2') => {
  $books.set(null)
  $isLoading.set(true)

  try {
    $books.set(await api.bookSearch(type, query, ext))
  } catch (e) {
    alert(e)
  }

  $isLoading.set(false)
}
