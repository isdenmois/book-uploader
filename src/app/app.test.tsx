import { render } from '@testing-library/react-native'
import React from 'react'

import 'react-native-gesture-handler/jestSetup'
jest.mock('./navigation', () => ({ MainNavigator: () => null }))
jest.mock('shared/libs/mmkv', () => ({ MMKV: { getString: () => null } }))
jest.mock('@react-navigation/native', () => ({
  NavigationContainer({ children, ...props }) {
    const Element: any = 'NavigationContainer'

    return <Element {...props}>{children}</Element>
  },
}))
jest.mock('react-native-fs', () => ({}))

import { NativeModules } from 'react-native'
import { App } from '../app'

test('App', () => {
  NativeModules.NavigationBarColor = { changeNavigationBarColor: jest.fn() }
  const { toJSON } = render(<App />)

  expect(toJSON()).toMatchSnapshot()
})
