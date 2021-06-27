import React from 'react'
import { render } from '@testing-library/react-native'
import { NativeModules } from 'react-native'
import { StatusBar } from '../status-bar'

test('StatusBar', () => {
  const changeNavigationBarColor = jest.fn()
  NativeModules.NavigationBarColor = { changeNavigationBarColor }

  expect(render(<StatusBar />).toJSON()).toMatchSnapshot()
  expect(changeNavigationBarColor).toHaveBeenCalled()
})
