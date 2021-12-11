import { mock, mockPromise } from 'shared/test-utils'

import { api } from 'shared/api'
import { $books, $isLoading, searchBooks } from './search-store'

describe('Search store', () => {
  it('should set initial store', () => {
    expect($books.get()).toEqual([])
    expect($isLoading.get()).toBeFalsy()
  })

  describe('searchBooks', () => {
    it('should get books from api', async () => {
      const [resolve] = mockPromise(api, 'bookSearch')

      const promise = searchBooks('FLIBUSTA', 'Harry Potter')
      expect($isLoading.get()).toBeTruthy()

      resolve([{ type: 'FLIBUSTA' }])
      await promise

      expect($books.get()).toEqual([{ type: 'FLIBUSTA' }])
      expect($isLoading.get()).toBeFalsy()
    })

    it('should show error', async () => {
      const alert = mock(global, 'alert')
      const [, reject] = mockPromise(api, 'bookSearch')

      const promise = searchBooks('FLIBUSTA', 'Harry Potter')
      expect($isLoading.get()).toBeTruthy()

      reject('Something went wrong!')
      await promise

      expect(alert).toHaveBeenCalledWith('Something went wrong!')
      expect($books.get()).toBeNull()
      expect($isLoading.get()).toBeFalsy()
    })
  })
})
