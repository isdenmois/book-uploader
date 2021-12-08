import { atom, action, onStart } from 'nanostores'
import { ZLIB_COOKIE } from 'shared/api/login'

export const authAtom = atom<string | null>(null)

onStart(authAtom, () => {
  authAtom.set(localStorage.getItem(ZLIB_COOKIE) || null)
})

export const setCookie = action(authAtom, 'setCookie', (store, cookie: string) => {
  localStorage.setItem(ZLIB_COOKIE, cookie)
  store.set(cookie)
})
