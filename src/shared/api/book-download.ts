import cheerio from 'react-native-cheerio'
import RNFS from 'react-native-fs'
import { API_CONFIG } from './config'
import { MMKV } from 'shared/libs'
import { querystring } from './utils'
import * as tor from './tor-request'
import { ZLIB_COOKIE } from './login'
import { BookItem, ProviderType } from './types'

type SetProgressFn = (progress: number) => void
export async function downloadFile(file: BookItem, fileName: string, setProgress: SetProgressFn): Promise<void> {
  setProgress(0.01)
  const { host, path, query, headers } = await getUrl(file.type, file.link)

  // TODO: move to tor-request
  await RNFS.downloadFile({
    fromUrl: API_CONFIG.TOR_HOST + '/api/rewrite' + querystring(Object.assign({}, query, { host, path })),
    toFile: `${RNFS.DocumentDirectoryPath}/${fileName}`,
    headers: Object.assign({}, headers, { 'user-agent': API_CONFIG.USER_AGENT }),
    progress: ({ contentLength, bytesWritten }) => setProgress(Math.round((bytesWritten / contentLength) * 100)),
  }).promise

  setProgress(0)
}

export function getUrl(type: ProviderType, link: string): any {
  if (type === 'ZLIB') {
    return zlibFileUrl(link)
  }

  return flibustaFileUrl(link)
}

function flibustaFileUrl(link: string) {
  return { host: API_CONFIG.FLIBUSTA_HOST, path: link }
}

async function zlibFileUrl(link: string) {
  const headers = { Cookie: MMKV.getString(ZLIB_COOKIE) }
  const $ = cheerio.load(await tor.request(API_CONFIG.ZLIB_HOST, link, { headers }))
  const path = $('a.addDownloadedBook').attr('href')
  const query = { nofollow: true }

  return { host: API_CONFIG.ZLIB_HOST, path, query, headers }
}
