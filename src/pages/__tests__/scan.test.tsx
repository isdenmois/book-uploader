import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
jest.mock('@react-native-community/async-storage', () => ({}));
jest.mock('react-native-camera');
import { AddressContext } from 'services/address';
import { ScanScreen } from '../scan';

test('ScanScreen', () => {
  const navigation: any = { goBack: jest.fn() };
  const setAddress = jest.fn();

  const RNCamera = render(
    <AddressContext.Provider value={{ setAddress }}>
      <ScanScreen navigation={navigation} />
    </AddressContext.Provider>,
  ).getByTestId('scan-camera');

  fireEvent(RNCamera, 'onBarCodeRead', { data: null });

  expect(setAddress).not.toHaveBeenCalled();
  expect(navigation.goBack).not.toHaveBeenCalled();

  fireEvent(RNCamera, 'onBarCodeRead', { data: 'http://192.168.1.200:8083' });

  expect(setAddress).toHaveBeenCalledWith('192.168.1.200');
  expect(navigation.goBack).toHaveBeenCalled();
});
