/**
 * @jest-environment jsdom
 */
import { screen, render, fireEvent } from 'solid-testing-library'
import '@testing-library/jest-dom'

import { Input } from '../input'

test('<Input />', () => {
  const onChange = jest.fn()

  render(() => <Input value='test' onChange={onChange} role='search' />)

  const element = screen.getByRole('search')

  expect(element).toBeInTheDocument()
  expect(onChange).not.toHaveBeenCalled()

  fireEvent.change(element, { target: { value: 'test1' } })
  expect(onChange).toHaveBeenCalledWith('test1')

  fireEvent.click(screen.getByTestId('clear'))
  expect(onChange).toHaveBeenCalledWith('')
})
