import { createStore } from 'effector'
import { setCookie } from 'shared/api'
import { DaylyDownloadsStat } from 'shared/api/daily-downloads'
import { setCookie as setCookieEvent, setInitialCookie } from './events'

export const $userCookie = createStore<string | null>(null)
export const $dailyDownloads = createStore<DaylyDownloadsStat>({
  dailyDownloads: 0,
  dailyDownloadsLimit: 0,
  resetTime: '',
})
export const $hasCookie = $userCookie.map(cookie => !!cookie)

$userCookie
  .on(setInitialCookie, (_, value) => value)
  .on(setCookieEvent, (_, value) => {
    setCookie(value)

    return value
  })
