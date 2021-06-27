import React from 'react'
import { act, render } from '@testing-library/react-native'
import { ThemeProvider } from '../theme'
import { Chip } from '../chip'

test('Chip', async () => {
  const { toJSON, rerender, unmount } = render(<Chip title='Var1' />, { wrapper: ThemeProvider })

  expect(toJSON()).toMatchSnapshot()

  rerender(<Chip title='Var1' selected />)
  expect(toJSON()).toMatchSnapshot()

  await act(async () => {
    unmount()
  })
})
