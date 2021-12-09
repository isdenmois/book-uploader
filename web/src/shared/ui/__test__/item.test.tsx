/**
 * @jest-environment jsdom
 */
import { screen, render, fireEvent } from 'solid-testing-library'
import '@testing-library/jest-dom'

import { Item } from '../item'
import { FileIcon } from '..'

test('<Item />', () => {
  const onClick = jest.fn()

  render(() => <Item onClick={onClick} title='Haro haro' icon={<FileIcon text='PDF' />} />)

  const element = screen.getByTestId('Haro haro')

  expect(element).toBeInTheDocument()
  expect(onClick).not.toHaveBeenCalled()

  fireEvent.click(element)
  expect(onClick).toHaveBeenCalled()
})
