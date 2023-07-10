import * as tor from './tor-request'
import { queryParams } from './utils'
import { API_CONFIG } from './config'

const LOGIN_PATH = '/rpc.php'
export const ZLIB_COOKIE = 'zlibauth'

export async function sendLogin(email: string, password: string): Promise<string> {
  const response: Response = await tor.request(API_CONFIG.ZLIB_HOST, LOGIN_PATH, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: queryParams({ email, password, action: 'login' }),
    parse: false,
  })
  const header = response.headers.get('kuki') || ''
  const cookies = new Map(header.split(';').map(cookie => cookie.split('=')) as Array<[string, string]>)

  if (cookies.size > 0) {
    return [...cookies].map(([key, value]) => `${key}=${value}`).join(';')
  }

  throw "Can't login"
}

export function setCookie(cookie: string) {
  return cookie ? localStorage.setItem(ZLIB_COOKIE, cookie) : localStorage.removeItem(ZLIB_COOKIE)
}
