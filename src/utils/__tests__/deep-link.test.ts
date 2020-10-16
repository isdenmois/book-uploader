import { act, renderHook } from '@testing-library/react-hooks';
import { Linking } from 'react-native';
import { mockPromise } from 'utils/test-utils/async';
import { useDeepLink } from '../deep-link';

test('useDeepLink', async () => {
  const [resolve] = mockPromise(Linking, 'getInitialURL');
  const onLink = jest.fn();

  const addEventListener = jest.spyOn(Linking, 'addEventListener');
  jest.spyOn(Linking, 'removeEventListener');

  const { unmount } = renderHook(() => useDeepLink(onLink));

  expect(Linking.addEventListener).toHaveBeenCalledWith('url', jasmine.any(Function));
  expect(onLink).not.toHaveBeenCalled();
  expect(Linking.removeEventListener).not.toHaveBeenCalled();

  await resolve('test url');

  expect(onLink).toHaveBeenCalledWith('test url');

  const listener = addEventListener.mock.calls[0][1];

  await act(async () => {
    listener({ url: 'bookapp://book query' });
  });

  expect(onLink).toHaveBeenCalledWith('bookapp://book query');

  unmount();

  expect(Linking.removeEventListener).toHaveBeenCalledWith('url', listener);
});
