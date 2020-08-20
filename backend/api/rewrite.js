const http = require('follow-redirects/http');
const querystring = require('querystring');

const isSocks = process.env.PROXY === 'socks';
const proxyAgent = isSocks ? require('socks-proxy-agent') : require('http-proxy-agent');

module.exports = async (oreq, ores) => {
  const passHeaders = ['cookie', 'accept', 'content-type', 'connection'];
  const { path, proxy, ...params } = oreq.query;

  const agent = new proxyAgent(
    isSocks
      ? {
          ipaddress: '127.0.0.1',
          port: 9050,
          type: 5,
        }
      : {
          protocol: 'https',
          host: proxy || process.env.HTTP_PROXY,
          prot: 443,
          rejectUnauthorized: false,
        },
  );

  const options = {
    agent,
    host: process.env.FLIBUSTA_HOST,
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
