jest.mock('features/auth', () => ({ setCookie: jest.fn() }))
import { mock, mockPromise } from 'shared/test-utils'

import { setCookie } from 'features/auth'
import { api } from 'shared/api'
import { $inProgress, login } from './login-page-model'

describe('Login model', () => {
  let resolve: Function, reject: Function, alert: any

  beforeEach(() => {
    ;[resolve, reject] = mockPromise(api, 'sendLogin')
    alert = mock(global, 'alert')
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should do nothing when empty data passed', () => {
    login('', '')
    expect(api.sendLogin).not.toHaveBeenCalled()
    expect(alert).not.toHaveBeenCalled()

    login(' ', '  ')
    expect(api.sendLogin).not.toHaveBeenCalled()
    expect(alert).not.toHaveBeenCalled()
  })

  it('should send login request and save cookie', async () => {
    login('hello@example.com ', ' 123456')

    expect(api.sendLogin).toHaveBeenCalledWith('hello@example.com', '123456')
    expect($inProgress.get()).toBeTruthy()
    expect(setCookie).not.toHaveBeenCalled()

    await resolve('supakuka')

    expect($inProgress.get()).toBeFalsy()
    expect(setCookie).toHaveBeenCalledWith('supakuka')
    expect(alert).not.toHaveBeenCalled()
  })

  it('should call alert with error', async () => {
    login(' test@fb.com', '123 ')

    expect(api.sendLogin).toHaveBeenCalledWith('test@fb.com', '123')
    expect($inProgress.get()).toBeTruthy()
    expect(setCookie).not.toHaveBeenCalled()

    await reject('Something is wrong')

    expect($inProgress.get()).toBeFalsy()
    expect(setCookie).not.toHaveBeenCalled()
    expect(alert).toHaveBeenCalledWith('Something is wrong')
  })
})
