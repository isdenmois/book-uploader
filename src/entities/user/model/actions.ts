import AsyncStorage from '@react-native-community/async-storage'

import { ZLIB_COOKIE } from 'shared/api/login'
import { dailyDownloadsFx } from './effects'
import { setInitialCookie, setCookie as setCookieEvent } from './events'

export async function preloadCookie() {
  const cookie = await AsyncStorage.getItem(ZLIB_COOKIE)

  setInitialCookie(cookie)
}

export const fetchDailyDownloads = () => {
  dailyDownloadsFx()
}

export const logOut = () => {
  setCookieEvent(null)
}
