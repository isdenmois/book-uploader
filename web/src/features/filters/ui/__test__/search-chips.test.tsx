/**
 * @jest-environment jsdom
 */
import { screen, render, fireEvent } from 'solid-testing-library'

import { SearchChips } from '../search-chips'
import { $source } from '../../model'

describe('<SearchChips />', () => {
  it('should get filters from store', () => {
    render(() => <SearchChips />)

    expect(screen.getByText('Flibusta').classList).toContain('selected')
    expect(screen.getByText('ZLib').classList).not.toContain('selected')

    expect(screen.queryByText('EPUB')).toBeNull()
  })

  it('should show extenstion when zlib selected', () => {
    render(() => <SearchChips />)

    fireEvent.click(screen.getByText('ZLib'))

    expect($source.get()).toBe('ZLIB')

    expect(screen.getByText('Flibusta').classList).not.toContain('selected')
    expect(screen.getByText('ZLib').classList).toContain('selected')

    expect(screen.queryByText('EPUB')).not.toBeNull()
  })
})
