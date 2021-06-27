import React from 'react'
import { act, fireEvent, render } from '@testing-library/react-native'
import { mockNavigation } from 'shared/utils/test-utils/navigation'
import { ThemeProvider } from '../theme'
import { Dialog } from '../dialog'

test('Dialog', async () => {
  const { NavigationWrapper, navContext } = mockNavigation()
  const wrapper = ({ children }) => (
    <ThemeProvider>
      <NavigationWrapper>{children}</NavigationWrapper>
    </ThemeProvider>
  )
  const { toJSON, getByTestId, unmount } = render(<Dialog>test</Dialog>, { wrapper })

  expect(toJSON()).toMatchSnapshot()

  fireEvent.press(getByTestId('dialogOverlay'))

  expect(navContext.goBack).toHaveBeenCalled()

  await act(async () => {
    unmount()
  })
})
