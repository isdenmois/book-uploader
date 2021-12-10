import { MMKV } from 'shared/libs'

import { ZLIB_COOKIE } from 'shared/api/login'
import { dailyDownloadsFx } from './effects'
import { setInitialCookie, setCookie as setCookieEvent } from './events'

export async function preloadCookie() {
  setInitialCookie(MMKV.getString(ZLIB_COOKIE))
}

export const fetchDailyDownloads = () => {
  dailyDownloadsFx()
}

export const logOut = () => {
  setCookieEvent(null)
}
