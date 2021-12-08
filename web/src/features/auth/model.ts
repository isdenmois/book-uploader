import { atom, action, onStart } from 'nanostores'
import { ZLIB_COOKIE } from 'shared/api/login'

export const $auth = atom<string | null>(null)

onStart($auth, () => {
  $auth.set(localStorage.getItem(ZLIB_COOKIE) || null)
})

export const setCookie = action($auth, 'setCookie', (store, cookie: string) => {
  localStorage.setItem(ZLIB_COOKIE, cookie)
  store.set(cookie)
})
