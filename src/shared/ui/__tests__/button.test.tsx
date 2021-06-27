import React from 'react'
import { act, render } from '@testing-library/react-native'
import { ThemeProvider } from '../theme'
import { Button } from '../button'

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper')

test('Button', async () => {
  const { toJSON, rerender, unmount } = render(<Button label='Hello' />, { wrapper: ThemeProvider })

  expect(toJSON()).toMatchSnapshot()

  rerender(<Button label='Hello' loading />)
  expect(toJSON()).toMatchSnapshot()

  await act(async () => {
    unmount()
  })
})
