/**
 * @jest-environment jsdom
 */
import { screen, render, fireEvent } from 'solid-testing-library'
import '@testing-library/jest-dom'

import { Chip } from '../chip'

test('<Chip />', () => {
  const onSelect = jest.fn()

  render(() => <Chip title='FB2' onSelect={onSelect} />)

  const element = screen.getByText('FB2')

  expect(element).toBeInTheDocument()
  expect(onSelect).not.toHaveBeenCalled()

  fireEvent.click(element)
  expect(onSelect).toHaveBeenCalled()
})
