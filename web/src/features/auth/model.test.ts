import { createPinia, setActivePinia } from 'pinia'
import { ZLIB_COOKIE } from 'shared/api/login'
import { mockObject } from 'shared/test-utils/mock'
import { useAuth } from './model'

describe('Auth feature', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should contain initial state', () => {
    const localStorage = mockObject(global, 'localStorage', { getItem: jest.fn().mockReturnValue('test') })
    const auth = useAuth()

    expect(localStorage.getItem).toHaveBeenCalledWith(ZLIB_COOKIE)
    expect(auth.$state).toEqual({ cookie: 'test' })
  })

  it('setCookie', () => {
    const localStorage = mockObject(global, 'localStorage', { setItem: jest.fn(), getItem: jest.fn() })
    const auth = useAuth()

    auth.setCookie('HELLO_IM_COOKIE')

    expect(auth.cookie).toBe('HELLO_IM_COOKIE')
    expect(localStorage.setItem).toHaveBeenCalledWith(ZLIB_COOKIE, 'HELLO_IM_COOKIE')
  })
})
