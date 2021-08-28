import { defineStore } from 'pinia'
import { ZLIB_COOKIE } from 'shared/api/login'

type AuthState = {
  cookie: string | null
}

export const useAuth = defineStore('auth', {
  state(): AuthState {
    return { cookie: localStorage.getItem(ZLIB_COOKIE) || null }
  },
  actions: {
    setCookie(cookie: string) {
      this.cookie = cookie
      localStorage.setItem(ZLIB_COOKIE, cookie)
    },
  },
})
