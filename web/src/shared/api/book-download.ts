import * as v from 'valibot'
import { querystring } from './utils'
import * as tor from './tor-request'
import { ZLIB_COOKIE } from './login'
import { API_CONFIG } from './config'
import { BookItem, ProviderType } from './types'

export async function downloadFile(file: BookItem): Promise<void> {
  const downloadUrl = await getUrl(file.type, file.link)
  let url: string

  if (typeof downloadUrl === 'object') {
    const { host, path, query } = downloadUrl
    const queryParams = Object.assign({}, query, { host, path })
    url = API_CONFIG.TOR_HOST.replace(/\/$/, '') + '/api/rewrite' + querystring(queryParams)
  } else {
    url = downloadUrl
  }

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
  return { host: API_CONFIG.FLIBUSTA_HOST, path: link, query: { host: API_CONFIG.FLIBUSTA_HOST, noproxy: true } }
}

function flibustaTorFileUrl(link: string) {
  return { host: API_CONFIG.FLIBUSTA_HOST_TOR, path: link, query: { host: API_CONFIG.FLIBUSTA_HOST_TOR } }
}

const ZLIB_FILE_RESPONSE = v.object({
  success: v.number(),
  file: v.object({
    downloadLink: v.string(),
  }),
})

async function zlibFileUrl(link: string) {
  const cookie = localStorage.getItem(ZLIB_COOKIE) ?? ''
  const body = await tor.request(API_CONFIG.ZLIB_HOST, `/eapi${link}/file`, { query: { cookie } })
  const { file } = v.parse(ZLIB_FILE_RESPONSE, body)

  return file.downloadLink
}
