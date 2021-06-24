import { createEffect } from 'effector'
import { getDailyDownloads } from 'shared/api/daily-downloads'
import { $dailyDownloads, $userCookie } from './store'

export const dailyDownloadsFx = createEffect(async () => {
  const cookie = $userCookie.getState()

  return getDailyDownloads(cookie)
})

$dailyDownloads.on(dailyDownloadsFx.doneData, (_, value) => value).reset(dailyDownloadsFx.fail)
