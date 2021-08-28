const http = require('follow-redirects/http')
const httpdd = require('http')
const querystring = require('querystring')

const isSocks = process.env.PROXY && process.env.PROXY.slice(0, 5) === 'socks'
const proxyAgent = isSocks ? require('socks-proxy-agent') : require('http-proxy-agent')

module.exports = async (oreq, ores) => {
  const passHeaders = ['cookie', 'accept', 'content-type', 'connection', 'content-length', 'origin', 'referer']
  let { path, proxy, host, nofollow, cookie, ...params } = oreq.query

  const agent = new proxyAgent(
    isSocks
      ? process.env.PROXY
      : {
          protocol: 'http',
          host: proxy || process.env.HTTP_PROXY,
          port: process.env.HTTP_PROXY_PORT,
          rejectUnauthorized: false,
        },
  )

  path = Object.keys(params).length > 0 ? `${encodeURI(path)}?${querystring.stringify(params)}` : path

  const options = {
    method: oreq.method,
    agent,
    host: host || process.env.FLIBUSTA_HOST,
    path,
    headers: {
      'user-agent':
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36',
    },
  }

  passHeaders.forEach(h => {
    if (oreq.headers[h]) {
      options.headers[h] = oreq.headers[h]
    }
  })

  if (cookie) {
    options.headers.cookie = cookie
  }

  const proxyReq = (nofollow ? httpdd : http).request(options, function (res) {
    ores.writeHead(res.statusCode, res.headers)
    res.pipe(ores, {
      end: true,
    })
  })

  oreq.pipe(proxyReq, {
    end: true,
  })
}
