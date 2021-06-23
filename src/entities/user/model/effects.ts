import { createEffect } from 'effector'
import { getDailyDownloads } from 'shared/api/daily-downloads'
import { $userCookie } from './store'

export const dailyDownloadsFx = createEffect(async () => {
  const cookie = $userCookie.getState()

  return getDailyDownloads(cookie)
})
