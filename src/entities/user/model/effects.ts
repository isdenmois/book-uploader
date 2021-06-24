import { createEffect } from 'effector'
import { api } from 'shared/api'
import { $dailyDownloads, $userCookie } from './store'

export const dailyDownloadsFx = createEffect(async () => {
  const cookie = $userCookie.getState()

  return api.getDailyDownloads(cookie)
})

$dailyDownloads.on(dailyDownloadsFx.doneData, (_, value) => value).reset(dailyDownloadsFx.fail)
