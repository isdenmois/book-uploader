export function querystring(query: Record<string, any> = {}): string {
  const qs = queryParams(query)

  return qs && '?' + qs
}

export function queryParams(data: Record<string, any> = {}): string {
  return Object.keys(data)
    .map(key => {
      const value = data[key]

      if (Array.isArray(value)) {
        const k = `${key}[]`
        const v = value.map(encodeURIComponent).join(`&${k}=`)
        return `${k}=${v}`
      }

      return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    })
    .join('&')
}
