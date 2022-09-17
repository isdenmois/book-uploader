import { querystring } from './utils'
import * as tor from './tor-request'
import { ZLIB_COOKIE } from './login'
import { API_CONFIG } from './config'
import { BookItem, ProviderType } from './types'

export async function downloadFile(file: BookItem): Promise<void> {
  const { host, path, query } = await getUrl(file.type, file.link)

  const queryParams = Object.assign({}, query, { host, path })
  const url = API_CONFIG.TOR_HOST.replace(/\/$/, '') + '/api/rewrite' + querystring(queryParams)

  const a = document.createElement('a')
  a.href = url

  a.click()
}

export function getUrl(type: ProviderType, link: string): any {
  if (type === 'ZLIB') {
    return zlibFileUrl(link)
  }

  if (type === 'FLIBUSTA_TOR') {
    return flibustaTorFileUrl(link)
  }

  return flibustaFileUrl(link)
}

function flibustaFileUrl(link: string) {
  return { host: API_CONFIG.FLIBUSTA_HOST, path: link, query: { noproxy: true } }
}

function flibustaTorFileUrl(link: string) {
  return { host: API_CONFIG.FLIBUSTA_HOST, path: link }
}

async function zlibFileUrl(link: string) {
  const cookie = localStorage.getItem(ZLIB_COOKIE) ?? ''
  const body: string = await tor.request(API_CONFIG.ZLIB_HOST, link, { query: { cookie } })
  const doc = new DOMParser().parseFromString(body, 'text/html')
  const path = doc.querySelector<any>('a.addDownloadedBook')?.attributes.href.value
  const query = { nofollow: true, cookie }

  return { host: API_CONFIG.ZLIB_HOST, path, query, cookie }
}
