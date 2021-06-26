import React from 'react'
import { fireEvent, render } from '@testing-library/react-native'
import { Text } from 'react-native'
import { createEvent, restore } from 'effector'
import { useStore } from 'effector-react'
import { mockNavigation } from 'shared/utils/test-utils/navigation'
import { Input } from '../input'
import { ThemeProvider } from '../theme'

test('Input', () => {
  const textChanged = createEvent<string>()
  const $value = restore(textChanged, '')
  const { NavigationWrapper } = mockNavigation()

  const Wrapper = () => {
    const value = useStore($value)

    return (
      <ThemeProvider>
        <NavigationWrapper>
          <Input icon={<Text />} value={value} onChangeText={textChanged} />
        </NavigationWrapper>
      </ThemeProvider>
    )
  }

  const { getByTestId } = render(<Wrapper />)

  fireEvent(getByTestId('input'), 'onChangeText', 'test')

  expect(getByTestId('input').props.value).toBe('test')
  expect($value.getState()).toBe('test')

  fireEvent.press(getByTestId('clear'))
  fireEvent.press(getByTestId('container'))

  expect(getByTestId('input').props.value).toBe('')
  expect($value.getState()).toBe('')
})
