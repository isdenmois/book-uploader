import * as tor from './tor-request'
import { queryParams } from './utils'
import { API_CONFIG } from './config'

const COOKIE_REGEXP = /onion\/?\?(.*?)"/
const LOGIN_PATH = '/rpc.php'
export const ZLIB_COOKIE = 'zlibauth'

export async function sendLogin(email: string, password: string): Promise<string> {
  const body: string = await tor.request(API_CONFIG.ZLIB_HOST, LOGIN_PATH, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: queryParams({ email, password, action: 'login' }),
  })
  let cookie = body.match(COOKIE_REGEXP)?.[1]

  if (!cookie) throw "Can't login"

  return cookie.replace('&', '; ')
}

export function setCookie(cookie: string) {
  return cookie ? localStorage.setItem(ZLIB_COOKIE, cookie) : localStorage.removeItem(ZLIB_COOKIE)
}
