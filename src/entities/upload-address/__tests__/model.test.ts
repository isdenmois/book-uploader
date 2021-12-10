jest.mock('shared/libs/mmkv', () => ({ MMKV: {} }))
import { mock } from 'shared/utils/test-utils/async'
import { MMKV } from 'shared/libs/mmkv'
import { $uploadAddress, setAddress, preloadAddress } from '../model'

describe('setAddress action', () => {
  let setString, removeItem

  beforeAll(() => {
    setString = mock(MMKV, 'setString')
    removeItem = mock(MMKV, 'removeItem')
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

  it('should update the MMKV', () => {
    setAddress('192.168.1.1')

    expect(setString).toHaveBeenCalledWith(expect.any(String), '192.168.1.1')
    expect(removeItem).not.toHaveBeenCalled()
  })

  it('should remove item from the MMKV when address is empty', () => {
    setAddress(null)

    expect(removeItem).toHaveBeenCalled()
    expect(setString).not.toHaveBeenCalled()
  })
})

test('preloadAddress action should only hydrate the store', async () => {
  mock(MMKV, 'getString').mockReturnValue('192.168.1.77')

  const setString = mock(MMKV, 'setString')
  const removeItem = mock(MMKV, 'removeItem')

  await preloadAddress()

  expect($uploadAddress.getState()).toBe('192.168.1.77')
  expect(setString).not.toHaveBeenCalled()
  expect(removeItem).not.toHaveBeenCalled()
})
