import { keepMount } from 'nanostores'
import { ZLIB_COOKIE } from 'shared/api/login'
import { localStorage } from 'shared/test-utils/local-storage'
import { authAtom, setCookie } from './model'

describe('Auth feature', () => {
  it('should contain initial state', () => {
    localStorage.getItem.mockReturnValue('test')
    keepMount(authAtom)

    expect(localStorage.getItem).toHaveBeenCalledWith(ZLIB_COOKIE)
    expect(authAtom.get()).toEqual('test')
  })

  it('setCookie', () => {
    keepMount(authAtom)

    setCookie('HELLO_IM_COOKIE')

    expect(authAtom.get()).toBe('HELLO_IM_COOKIE')
    expect(localStorage.setItem).toHaveBeenCalledWith(ZLIB_COOKIE, 'HELLO_IM_COOKIE')
  })
})
