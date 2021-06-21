import React from 'react'
import { RecoilRoot } from 'recoil'
import { fireEvent, render } from '@testing-library/react-native'
import { mock } from 'shared/utils/test-utils/async'
jest.mock('@react-native-community/async-storage', () => ({ getItem: () => null }))
jest.mock('react-native-camera')
import AsyncStorage from '@react-native-community/async-storage'
import { ScanScreen } from '../scan'

test('ScanScreen', () => {
  jest.useFakeTimers()
  const setAddress = mock(AsyncStorage, 'setItem')
  const navigation: any = { goBack: jest.fn() }

  const RNCamera = render(
    <RecoilRoot>
      <ScanScreen navigation={navigation} />
    </RecoilRoot>,
  ).getByTestId('scan-camera')

  fireEvent(RNCamera, 'onBarCodeRead', { data: null })

  expect(setAddress).not.toHaveBeenCalled()
  expect(navigation.goBack).not.toHaveBeenCalled()

  fireEvent(RNCamera, 'onBarCodeRead', { data: 'http://192.168.1.200:8083' })
  jest.runAllTimers()

  expect(setAddress).toHaveBeenCalledWith('address', '192.168.1.200')
  expect(navigation.goBack).toHaveBeenCalled()
})
