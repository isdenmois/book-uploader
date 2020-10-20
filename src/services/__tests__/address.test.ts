import { useRecoilState } from 'recoil';
import { act, renderRecoilHook } from 'react-recoil-hooks-testing-library';
import { BASE } from 'utils/request';
import { mock } from 'utils/test-utils/async';

jest.mock('@react-native-community/async-storage', () => ({ getItem: () => null }));

import AsyncStorage from '@react-native-community/async-storage';
import { addressState } from '../address';

test('useCreateAddressContext', async () => {
  const setItem = mock(AsyncStorage, 'setItem');
  const { result } = renderRecoilHook(() => useRecoilState(addressState), {
    states: [{ recoilState: addressState, initialValue: '192.168.1.1' }],
  });
  let [address, setAddress] = result.current;

  expect(address).toBe('192.168.1.1');
  expect(BASE.URL).toBe('http://192.168.1.1:8083');

  act(() => {
    setAddress('192.168.1.77');
  });
  [address, setAddress] = result.current;

  expect(address).toBe('192.168.1.77');
  expect(setItem).toHaveBeenCalledWith('address', '192.168.1.77');
  expect(BASE.URL).toBe('http://192.168.1.77:8083');
});
