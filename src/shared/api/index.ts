import { downloadFile } from './book-download'
import { getDailyDownloads, DaylyDownloadsStat } from './daily-downloads'
import { bookSearch } from './book-search'
import { sendLogin, setCookie } from './login'
import { uploadFile } from './upload'

export * from './types'
export type { DaylyDownloadsStat }
export const api = { downloadFile, bookSearch, getDailyDownloads, sendLogin, setCookie, uploadFile }
