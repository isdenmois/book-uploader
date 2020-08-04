const http = require('follow-redirects/http');
const querystring = require('querystring');
const httpProxyAgent = require('http-proxy-agent');

module.exports = async (oreq, ores) => {
  const passHeaders = ['cookie', 'accept', 'content-type', 'connection'];
  const { path, proxy, ...params } = oreq.query;

  const agent = new httpProxyAgent({
    protocol: 'https',
    host: proxy || process.env.HTTP_PROXY,
    prot: 443,
    rejectUnauthorized: false,
  });

  const options = {
    agent,
    host: process.env.FLIBUSTA_HOST,
    path: Object.keys(params).length > 0 ? `${path}?${querystring.stringify(params)}` : path,
    headers: {
      'user-agent': process.env.USER_AGENT,
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
