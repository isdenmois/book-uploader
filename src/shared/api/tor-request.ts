import { API_CONFIG } from './config'
import { querystring } from './utils'

const JSON_TYPE = 'application/json'

interface RequestParams {
  query?: Record<string, any>
  method?: string
  body?: string
  headers?: Record<string, string>
}

export function request<T>(host: string, path: string, params: RequestParams = {}): Promise<T> {
  params.headers = Object.assign({}, params.headers, {
    'User-Agent': API_CONFIG.USER_AGENT,
  })
  const queryParams = Object.assign({}, params.query, { host, path })
  const url = API_CONFIG.TOR_HOST + '/api/rewrite' + querystring(queryParams)

  return fetch(url, params).then(response => {
    if (response.headers.get('Content-Type').startsWith(JSON_TYPE)) {
      return response.json()
    }

    return response.text()
  })
}
