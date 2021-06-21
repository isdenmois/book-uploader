import { atom, selector } from 'recoil'
import { bookSearch } from 'shared/api/book-search'
import { ProviderType } from 'shared/api/types'
import { catchError } from 'shared/utils'

export const typeState = atom<ProviderType>({ key: 'type', default: 'zlib' })
export const queryState = atom({ key: 'query', default: '' })
export const extensionState = atom({ key: 'extension', default: 'epub' })

type BookParams = { type: ProviderType; extension: string; query: string }
export const booksParams = atom<BookParams>({ key: 'booksParams', default: null })

export const booksSelector = selector({
  key: 'books',
  get({ get }) {
    const params = get(booksParams)

    if (!params) return null
    const { type, extension, query } = params

    return bookSearch(type, query, extension).catch(catchError())
  },
})
