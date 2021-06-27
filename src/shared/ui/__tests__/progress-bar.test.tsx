import React from 'react'
import { act, render } from '@testing-library/react-native'
import { ThemeProvider } from '../theme'
import { ProgressBar } from '../progress-bar'

test('ProgressBar', async () => {
  const { toJSON, rerender, unmount } = render(<ProgressBar color='primary' />, { wrapper: ThemeProvider })

  expect(toJSON()).toMatchSnapshot()

  rerender(<ProgressBar color='primary' showAlways />)
  expect(toJSON()).toMatchSnapshot()

  rerender(<ProgressBar color='primary' progress={50} />)
  expect(toJSON()).toMatchSnapshot()

  rerender(<ProgressBar color='primary' progress={100} />)
  expect(toJSON()).toMatchSnapshot()

  await act(async () => {
    unmount()
  })
})
