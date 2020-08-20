const http = require('follow-redirects/http');
const querystring = require('querystring');
const httpProxyAgent = require('http-proxy-agent');

module.exports = async (oreq, ores) => {
  const passHeaders = ['cookie', 'accept', 'content-type', 'connection'];
  const { path, proxy, ...params } = oreq.query;

  const agent = new httpProxyAgent({
    protocol: 'https',
    host: proxy || 'fl-234-156-1.fri-gate0.biz',
    prot: 443,
    rejectUnauthorized: false,
  });

  const options = {
    agent,
    host: 'flibustahezeous3.onion',
    path: Object.keys(params).length > 0 ? `${path}?${querystring.stringify(params)}` : path,
    headers: {
      'user-agent':
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.89 Safari/537.36',
    },
  };

  passHeaders.forEach(h => {
    if (oreq.headers[h]) {
      options.headers[h] = oreq.headers[h];
    }
  });

  const proxyReq = http.request(options, function (res) {
    ores.writeHead(res.statusCode, res.headers);
    res.pipe(ores, {
      end: true,
    });
  });

  oreq.pipe(proxyReq, {
    end: true,
  });
};
