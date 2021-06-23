import { createStore } from 'effector'
import { BookItem } from 'shared/api'

export const $booksFound = createStore<BookItem[] | null>(null)
