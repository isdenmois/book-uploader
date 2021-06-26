import { mock } from 'shared/utils/test-utils/async'

jest.mock('@react-native-community/async-storage', () => ({}))

import AsyncStorage from '@react-native-community/async-storage'
import { $uploadAddress, setAddress, preloadAddress } from '../model'

describe('setAddress action', () => {
  let setItem, removeItem

  beforeAll(() => {
    setItem = mock(AsyncStorage, 'setItem')
    removeItem = mock(AsyncStorage, 'removeItem')
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should update the $uploadAddress store', () => {
    setAddress('192.168.1.1')
    expect($uploadAddress.getState()).toBe('192.168.1.1')

    setAddress('192.168.1.60')
    expect($uploadAddress.getState()).toBe('192.168.1.60')
  })

  it('should update the AsyncStorage', () => {
    setAddress('192.168.1.1')

    expect(setItem).toHaveBeenCalledWith(jasmine.any(String), '192.168.1.1')
    expect(removeItem).not.toHaveBeenCalled()
  })

  it('should remove item from the AsyncStorage when address is empty', () => {
    setAddress(null)

    expect(removeItem).toHaveBeenCalled()
    expect(setItem).not.toHaveBeenCalled()
  })
})

test('preloadAddress action should only hydrate the store', async () => {
  mock(AsyncStorage, 'getItem').mockReturnValue(Promise.resolve('192.168.1.77'))

  const setItem = mock(AsyncStorage, 'setItem')
  const removeItem = mock(AsyncStorage, 'removeItem')

  await preloadAddress()

  expect($uploadAddress.getState()).toBe('192.168.1.77')
  expect(setItem).not.toHaveBeenCalled()
  expect(removeItem).not.toHaveBeenCalled()
})
