import { querystring } from './utils'
import * as tor from './tor-request'
import { ZLIB_COOKIE } from './login'
import { BookItem, ProviderType } from './types'

export async function downloadFile(file: BookItem): Promise<void> {
  const { host, path, query } = await getUrl(file.type, file.link)

  const queryParams = Object.assign({}, query, { host, path })
  const url = import.meta.env.VITE_TOR_HOST?.replace(/\/$/, '') + '/api/rewrite' + querystring(queryParams)

  console.log(url)

  const a = document.createElement('a')
  a.href = url

  a.click()
}

export function getUrl(type: ProviderType, link: string): any {
  if (type === 'ZLIB') {
    return zlibFileUrl(link)
  }

  return flibustaFileUrl(link)
}

function flibustaFileUrl(link: string) {
  return { host: import.meta.env.VITE_FLIBUSTA_HOST, path: link }
}

async function zlibFileUrl(link: string) {
  const cookie = localStorage.getItem(ZLIB_COOKIE) ?? ''
  const body: string = await tor.request(import.meta.env.VITE_ZLIB_HOST, link, { query: { cookie } })
  const doc = new DOMParser().parseFromString(body, 'text/html')
  const path = doc.querySelector<any>('a.addDownloadedBook')?.attributes.href.value
  const query = { nofollow: true, cookie }

  return { host: import.meta.env.VITE_ZLIB_HOST, path, query, cookie }
}
