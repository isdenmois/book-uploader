import { querystring } from './utils'

const JSON_TYPE = 'application/json'

interface RequestParams {
  query?: Record<string, any>
  method?: string
  body?: string
  headers?: Record<string, string>
}

export function request<T>(host: string, path: string, params: RequestParams = {}): Promise<T> {
  const queryParams = Object.assign({}, params.query, { host, path })
  const url = (import.meta.env.VITE_TOR_HOST || '').replace(/\/$/, '') + '/api/rewrite' + querystring(queryParams)

  return fetch(url, params).then(response => {
    if (response.headers.get('Content-Type')?.startsWith(JSON_TYPE)) {
      return response.json()
    }

    return response.text()
  })
}
