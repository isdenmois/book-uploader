import { renderHook } from '@testing-library/react-hooks'
import { useAutofocus } from '../autofocus'
import { mockNavigation } from '../test-utils/navigation'

test('useAutofocus', () => {
  const { NavigationWrapper: wrapper } = mockNavigation()
  jest.useFakeTimers()
  const focus = jest.fn()
  let initQuery = null
  let enabled = true

  const { result, rerender } = renderHook(() => useAutofocus([initQuery], enabled), { wrapper })

  jest.runAllTimers()

  initQuery = '123'
  result.current.current = { focus } as any
  rerender()
  jest.runAllTimers()

  expect(focus).toHaveBeenCalled()
})
