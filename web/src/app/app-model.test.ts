jest.mock('features/filters/ui/search-filters', () => ({}))
import { cleanStores } from 'nanostores'
import 'shared/test-utils/local-storage'
import { $auth } from 'features/auth'
import { $source } from 'features/filters'
import { $showLogin } from './app-model'

describe('showLogin', () => {
  afterAll(() => {
    cleanStores($auth, $source)
  })

  it('for FLIBUSTA do not show login', () => {
    $source.set('FLIBUSTA')

    $auth.set(null)
    expect($showLogin.get()).toBeFalsy()

    $auth.set('aaaa')
    expect($showLogin.get()).toBeFalsy()
  })

  it('for ZLIB show login when cookie is empty', () => {
    $source.set('ZLIB')

    $auth.set(null)
    expect($showLogin.get()).toBeTruthy()

    $auth.set('aaaa')
    expect($showLogin.get()).toBeFalsy()
  })
})
