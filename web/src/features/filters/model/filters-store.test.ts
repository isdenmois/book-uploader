import { createPinia, setActivePinia } from 'pinia'
import { useFilters } from './filters-store'

describe('Feature filters model', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should contain initial state', () => {
    const filters = useFilters()

    expect(filters.$state).toEqual({
      ext: 'epub',
      query: '',
      source: 'FLIBUSTA',
    })
  })

  it('should set extenstion', () => {
    const filters = useFilters()

    filters.setExt('fb2')

    expect(filters.ext).toBe('fb2')
  })

  it('should set query', () => {
    const filters = useFilters()

    filters.setQuery('Harry Potter')

    expect(filters.query).toBe('Harry Potter')
  })

  it('should set source', () => {
    const filters = useFilters()

    filters.setSource('ZLIB')

    expect(filters.source).toBe('ZLIB')
  })
})
