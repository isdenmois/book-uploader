import { createPinia, setActivePinia } from 'pinia'
import { api } from 'shared/api'
import { mockPromise } from 'shared/test-utils/async'
import { mock } from 'shared/test-utils/mock'
import { useSearch } from './search-store'

describe('Search store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should set initial store', () => {
    const search = useSearch()

    expect(search.$state).toEqual({
      books: [],
      isLoading: false,
    })
  })

  describe('searchBooks', () => {
    it('should get books from api', async () => {
      const search = useSearch()
      const [resolve] = mockPromise(api, 'bookSearch')

      const promise = search.searchBooks('FLIBUSTA', 'Harry Potter')
      expect(search.isLoading).toBeTruthy()

      resolve([{ type: 'FLIBUSTA' }])
      await promise

      expect(search.books).toEqual([{ type: 'FLIBUSTA' }])
      expect(search.isLoading).toBeFalsy()
    })

    it('should show error', async () => {
      const search = useSearch()
      const alert = mock(global, 'alert')
      const [, reject] = mockPromise(api, 'bookSearch')

      const promise = search.searchBooks('FLIBUSTA', 'Harry Potter')
      expect(search.isLoading).toBeTruthy()

      reject('Something went wrong!')
      await promise

      expect(alert).toHaveBeenCalledWith('Something went wrong!')
      expect(search.books).toBeNull()
      expect(search.isLoading).toBeFalsy()
    })
  })
})
