import 'shared/test-utils/local-storage'
import { authAtom } from 'features/auth'
import { sourceAtom } from 'features/filters'
import { $showLogin } from './app-model'
import { cleanStores } from 'nanostores'

describe('showLogin', () => {
  afterAll(() => {
    cleanStores(authAtom, sourceAtom)
  })

  it('for FLIBUSTA do not show login', () => {
    sourceAtom.set('FLIBUSTA')

    authAtom.set(null)
    expect($showLogin.get()).toBeFalsy()

    authAtom.set('aaaa')
    expect($showLogin.get()).toBeFalsy()
  })

  it('for ZLIB show login when cookie is empty', () => {
    sourceAtom.set('ZLIB')

    authAtom.set(null)
    expect($showLogin.get()).toBeTruthy()

    authAtom.set('aaaa')
    expect($showLogin.get()).toBeFalsy()
  })
})
