jest.mock('features/filters/ui/search-filters', () => ({}))
import { cleanStores, keepMount } from 'nanostores'
import { $ext, $query, $source } from 'features/filters'
import { $books, $isLoading } from 'features/search'
import { api } from 'shared/api'
import { mockPromise } from 'shared/test-utils/async'
import { mockObject } from 'shared/test-utils/mock'

import { startSearch } from './search-model'

describe('Search page model', () => {
  let location: Location, history: History

  beforeEach(() => {
    location = mockObject(global, 'location', { search: 'azaza' })
    history = mockObject(global, 'history', { replaceState: jest.fn() })
  })

  afterEach(() => {
    cleanStores($ext, $query, $source, $books)
  })

  describe('parse URL params on mount', () => {
    it('should do nothing when passed incorrect params', () => {
      const [, , bookSearch] = mockPromise(api, 'bookSearch')
      location.search = 'ext=epub'
      keepMount($books)

      expect(bookSearch).not.toHaveBeenCalled()
    })

    it('should parse params and start search', async () => {
      const [resolve, , bookSearch] = mockPromise(api, 'bookSearch')
      location.search = 'q=test'
      keepMount($books)

      expect(bookSearch).toHaveBeenCalledWith('FLIBUSTA', 'test', 'epub')

      await resolve([{ type: 'FLIBUSTA' }])

      expect($books.get()).toEqual([{ type: 'FLIBUSTA' }])
    })
  })

  it('clearBooks when filters changes', () => {
    $books.set([{} as any])
    $ext.set('pdf')
    expect($books.get()).toBeNull()

    $books.set([{} as any])
    $query.set('aaa')
    expect($books.get()).toBeNull()

    $books.set([{} as any])
    $source.set('ZLIB')
    expect($books.get()).toBeNull()
  })

  it('startSearch', async () => {
    const [resolve] = mockPromise(api, 'bookSearch')

    startSearch()
    expect($isLoading.get()).toBeTruthy()

    await resolve([{ type: 'ZLIB' }])

    expect($isLoading.get()).toBeFalsy()
    expect($books.get()).toEqual([{ type: 'ZLIB' }])
    expect(history.replaceState).toHaveBeenCalled()
  })
})
