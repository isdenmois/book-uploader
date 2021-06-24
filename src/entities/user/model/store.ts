import { createStore } from 'effector'
import { api, DaylyDownloadsStat } from 'shared/api'
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
    api.setCookie(value)

    return value
  })
