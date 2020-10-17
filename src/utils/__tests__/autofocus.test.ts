import { renderHook } from '@testing-library/react-hooks';
import { useAutofocus } from '../autofocus';

test('useAutofocus', () => {
  jest.useFakeTimers();
  const focus = jest.fn();
  let initQuery = null;

  const { result, rerender } = renderHook(() => useAutofocus([initQuery]));

  jest.runAllTimers();

  initQuery = '123';
  result.current.current = { focus } as any;
  rerender();
  jest.runAllTimers();

  expect(focus).toHaveBeenCalled();
});
