import { ZLIB_HOST } from '@env';
import AsyncStorage from '@react-native-community/async-storage';
import { torRequest } from './tor-request';
import { queryParams } from './utils';

const COOKIE_REGEXP = /onion\/\?(.*?)"/;
const LOGIN_PATH = '/rpc.php';
export const ZLIB_COOKIE = 'zlibauth';

export async function sendLogin(email, password) {
  const body: string = await torRequest(ZLIB_HOST, LOGIN_PATH, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: queryParams({ email, password, action: 'login' }),
  });
  let cookie = body.match(COOKIE_REGEXP)?.[1];

  if (!cookie) throw "Can't login";

  return cookie.replace('&', '; ');
}

export function setCookie(cookie: string) {
  return AsyncStorage.setItem(ZLIB_COOKIE, cookie);
}
