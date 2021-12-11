/**
 * @jest-environment jsdom
 */
import { fireEvent, render, screen } from 'solid-testing-library'
import '@testing-library/jest-dom'

import { mockPromise } from 'shared/test-utils'
jest.mock('features/auth', () => ({ setCookie: jest.fn() }))

import { setCookie } from 'features/auth'
import { api } from 'shared/api'
import { LoginPage } from './login-page'

test('<LoginPage/>', async () => {
  const [resolve] = mockPromise(api, 'sendLogin')

  render(() => <LoginPage />)

  fireEvent.change(screen.getByRole('textbox', { name: 'email' }), { target: { value: 'test@example.com' } })
  fireEvent.change(screen.getByRole('textbox', { name: 'password' }), { target: { value: '654321' } })
  fireEvent.click(screen.getByRole('button'))

  expect(screen.getByRole('progressbar')).toBeInTheDocument()
  expect(api.sendLogin).toHaveBeenCalledWith('test@example.com', '654321')

  await resolve('thatisyourcookie')

  expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
  expect(setCookie).toHaveBeenCalledWith('thatisyourcookie')
})
