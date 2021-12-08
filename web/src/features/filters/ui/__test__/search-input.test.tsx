/**
 * @jest-environment jsdom
 */
import { screen, render, fireEvent } from 'solid-testing-library'

import { SearchInput } from '../search-input'
import { $query } from '../../model'

describe('<SearchInput />', () => {
  it('should get query from store', () => {
    $query.set('Harry')

    render(() => <SearchInput />)

    expect((screen.getByRole('searchbox') as HTMLInputElement).value).toBe('Harry')
  })

  it('should set query on event', () => {
    render(() => <SearchInput />)

    const input = screen.getByRole('searchbox') as HTMLInputElement

    fireEvent.change(input, { target: { value: 'Hyperion' } })

    expect($query.get()).toBe('Hyperion')
  })
})
