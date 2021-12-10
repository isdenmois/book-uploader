import { API_CONFIG } from './config'
import { ProviderType } from './types'
import { querystring } from './utils'

export const getImageUrl = (type: ProviderType, path?: string) => {
  if (!path) {
    return undefined
  }

  const host = { ZLIB: API_CONFIG.ZLIB_HOST, FLIBUSTA: API_CONFIG.FLIBUSTA_HOST }[type]
  const queryParams = { host, path }

  return API_CONFIG.TOR_HOST.replace(/\/$/, '') + '/api/rewrite' + querystring(queryParams)
}
