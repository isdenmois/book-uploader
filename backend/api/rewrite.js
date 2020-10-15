const http = require('follow-redirects/http');
const httpdd = require('http');
const querystring = require('querystring');

const isSocks = process.env.PROXY && process.env.PROXY.slice(0, 5) === 'socks';
const proxyAgent = isSocks ? require('socks-proxy-agent') : require('http-proxy-agent');

module.exports = async (oreq, ores) => {
  const passHeaders = [
    'cookie',
    'accept',
    'content-type',
    'connection',
    'content-length',
    'origin',
    'referer',
    // 'accept-ecoding',
    // 'accept-language',
    // 'cache-control',
    // 'upgrade-insecure-requests',
    // 'proxy-connection',
  ];
  const { path, proxy, host, nofollow, ...params } = oreq.query;

  const agent = new proxyAgent(
    isSocks
      ? process.env.PROXY
      : {
          protocol: 'https',
          host: proxy || process.env.HTTP_PROXY,
          prot: 443,
          rejectUnauthorized: false,
        },
  );

  const options = {
    method: oreq.method,
    agent,
    host: host || process.env.FLIBUSTA_HOST,
    path,
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
  console.log(options);

  const proxyReq = (nofollow ? httpdd : http).request(options, function (res) {
    ores.writeHead(res.statusCode, res.headers);
    res.pipe(ores, {
      end: true,
    });
  });

  oreq.pipe(proxyReq, {
    end: true,
  });
};
