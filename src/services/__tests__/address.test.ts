import { act, renderHook } from '@testing-library/react-hooks';
import { BASE } from 'utils/request';
import { mock, mockPromise } from 'utils/test-utils/async';

jest.mock('@react-native-community/async-storage', () => ({}));

import AsyncStorage from '@react-native-community/async-storage';
import { useCreateAddressContext } from '../address';

test('useCreateAddressContext', async () => {
  mock(AsyncStorage, 'setItem');
  const [resolve] = mockPromise(AsyncStorage, 'getItem');
  const { result } = renderHook(() => useCreateAddressContext());

  expect(result.current.address).toBeNull();
  expect(BASE.URL).toBeNull();

  await resolve(null);

  expect(result.current.address).toBe('');
  expect(BASE.URL).toBeNull();

  act(() => {
    result.current.setAddress('192.168.1.1');
  });

  expect(result.current.address).toBe('192.168.1.1');
});
