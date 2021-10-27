/**
 * @jest-environment jsdom
 */
import { createTestingPinia } from '@pinia/testing'
import { render, screen, fireEvent } from '@testing-library/vue'

import SearchChips from '../search-chips.vue'
import { useFilters } from '../../model'

describe('<SearchChips />', () => {
  it('should get filters from store', () => {
    const pinia = createTestingPinia()

    render(SearchChips, { global: { plugins: [pinia] } })

    expect(screen.getByText('Flibusta').classList).toContain('selected')
    expect(screen.getByText('ZLib').classList).not.toContain('selected')

    expect(screen.queryByText('EPUB')).toBeNull()
  })

  it('should show extenstion when zlib selected', async () => {
    const pinia = createTestingPinia()
    const filters = useFilters()

    render(SearchChips, { global: { plugins: [pinia] } })

    await fireEvent.click(screen.getByText('ZLib'))

    expect(filters.source).toBe('ZLIB')

    expect(screen.getByText('Flibusta').classList).not.toContain('selected')
    expect(screen.getByText('ZLib').classList).toContain('selected')

    expect(screen.queryByText('EPUB')).not.toBeNull()
  })
})
