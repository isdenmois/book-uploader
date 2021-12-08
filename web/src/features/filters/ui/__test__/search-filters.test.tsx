/**
 * @jest-environment jsdom
 */
import { screen, render, fireEvent } from 'solid-testing-library'

import { SearchFilters } from '../search-filters'

describe('<SearchFilters />', () => {
  it('should emit search event', () => {
    const onSearch = jest.fn()

    render(() => <SearchFilters onSearch={onSearch} />)

    fireEvent.submit(screen.getByRole('searchbox'))

    expect(onSearch).toHaveBeenCalled()
  })
})
