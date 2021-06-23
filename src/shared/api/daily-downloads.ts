import { ZLIB_HOST } from '@env'
import * as tor from './tor-request'

export interface DaylyDownloadsStat {
  dailyDownloads: number
  dailyDownloadsLimit: number
  resetTime: string
}

export function getDailyDownloads(cookie: string): Promise<DaylyDownloadsStat> {
  return tor.request(ZLIB_HOST, '/papi/user/dstats', { headers: { cookie } })
}
