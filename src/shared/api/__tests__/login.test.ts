jest.mock('shared/libs/mmkv', () => ({ MMKV: {} }))
import { MMKV } from 'shared/libs/mmkv'
import { mock, mockPromise } from 'shared/utils/test-utils/async'
import * as tor from '../tor-request'
import { sendLogin, setCookie, ZLIB_COOKIE } from '../login'

describe('sendLogin', () => {
  let resolve

  beforeEach(() => {
    ;[resolve] = mockPromise(tor, 'request')
  })

  it('successful login', async () => {
    await resolve('<a href="test.onion?remix=1&value=true"></a>')

    expect(await sendLogin('i', 'moron')).toBe('remix=1; value=true')
    expect(tor.request).toHaveBeenCalledWith(
      expect.any(String),
      '/rpc.php',
      expect.objectContaining({ body: 'email=i&password=moron&action=login' }),
    )
  })

  it('error login', async () => {
    await resolve('<div></div>')

    await expect(sendLogin('i', 'moron')).rejects.toBe("Can't login")
  })
})

test('setCookie', async () => {
  mock(MMKV, 'setString')

  await setCookie('123')

  expect(MMKV.setString).toHaveBeenCalledWith(ZLIB_COOKIE, '123')
})
