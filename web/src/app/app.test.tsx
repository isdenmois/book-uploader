/**
 * @jest-environment jsdom
 */
import { fireEvent, render, screen } from 'solid-testing-library'
import '@testing-library/jest-dom'
import { $auth } from 'features/auth'
import { $source } from 'features/filters'

jest.mock('pages/search-page', () => ({ SearchPage: () => <h1>SearchPage</h1> }))
jest.mock('pages/login-page', () => ({ LoginPage: () => <h1>LoginPage</h1> }))

import { App } from './app'

test('<App/>', () => {
  $source.set('FLIBUSTA')
  render(() => <App />)

  expect(screen.getByRole('heading', { name: 'SearchPage' })).toBeInTheDocument()
  expect(screen.queryByRole('heading', { name: 'LoginPage' })).not.toBeInTheDocument()

  $source.set('ZLIB')

  expect(screen.getByRole('heading', { name: 'LoginPage' })).toBeInTheDocument()
  expect(screen.queryByRole('heading', { name: 'SearchPage' })).not.toBeInTheDocument()
})
