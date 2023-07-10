const http = require('follow-redirects/http')
const httpdd = require('http')
const querystring = require('querystring')

const isSocks = process.env.PROXY && process.env.PROXY.slice(0, 5) === 'socks'
const proxyAgent = isSocks ? require('socks-proxy-agent').SocksProxyAgent : require('http-proxy-agent')

module.exports = async (oreq, ores) => {
  const passHeaders = ['cookie', 'accept', 'content-type', 'connection', 'content-length']
  let { path, proxy, host, nofollow, cookie, noproxy, ...params } = oreq.query

  path = Object.keys(params).length > 0 ? `${encodeURI(path)}?${querystring.stringify(params)}` : path

  const options = {
    method: oreq.method,
    host: host || process.env.FLIBUSTA_HOST,
    path,
    headers: {
      'user-agent':
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.5112.83 Safari/537.36',
    },
  }

  if (!noproxy) {
    passHeaders.push('origin', 'referer')
    options.agent = new proxyAgent(
      isSocks
        ? process.env.PROXY
        : {
            protocol: 'http',
            host: proxy || process.env.HTTP_PROXY,
            port: process.env.HTTP_PROXY_PORT,
            rejectUnauthorized: false,
          },
    )
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
    if (res.headers['set-cookie']) {
      const cookies = []
        .concat(res.headers['set-cookie'])
        .map(cookie => cookie.split(';')[0])
        .join(';')

      ores.setHeader('Access-Control-Expose-Headers', 'kuki')
      ores.setHeader('kuki', cookies)
    }

    ores.writeHead(res.statusCode, res.headers)

    res.pipe(ores, {
      end: true,
    })
  })

  oreq.pipe(proxyReq, {
    end: true,
  })
}
