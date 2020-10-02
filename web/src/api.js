/*global DOMParser */

const config = {
  useProxy: true,
  search: {
    path: '/api/rewrite',
    params: { path: '/opds/search', searchType: 'books' },
    query: {
      type: 'query',
      name: 'searchTerm',
    },
  },
  selectors: {
    entry: 'entry',
    link: 'link[href$="fb2"]',
    title: 'title',
    author: 'author name',
    translation: {
      selector: 'content',
      regexp: 'Перевод:\\s?(.+?)\\s?[&<]',
    },
    lang: {
      selector: 'content',
      regexp: 'Язык:\\s?(.+?)\\s?[&<]',
    },
    size: {
      selector: 'content',
      regexp: 'Размер:\\s?(.+?)\\s?[&<]',
    },
    ext: 'fb2.zip',
  },
};

function querystring(query = {}) {
  // get array of key value pairs ([[k1, v1], [k2, v2]])
  const qs = Object.entries(query)
    // filter pairs with undefined value
    .filter(pair => pair[1] !== undefined)
    // encode keys and values, remove the value if it is null, but leave the key
    .map(pair =>
      pair
        .filter(i => i !== null)
        .map(encodeURIComponent)
        .join('='),
    )
    .join('&');

  return qs && '?' + qs;
}

const parser = new DOMParser();

function parseSearch(body, selectors) {
  const doc = parser.parseFromString(body, 'text/html');
  const $ = s => Array.prototype.slice.apply(doc.querySelectorAll(s));
  const translation = selectors.translation && new RegExp(selectors.translation.regexp, 'i');

  const books = $(selectors.entry).map(entry => {
    if (!entry.querySelector(selectors.link)) return;

    const data = {
      title: entry.querySelector(selectors.title).innerText,
      link: entry.querySelector(selectors.link).attributes.href.value,
      ext: selectors.ext,
    };

    const authors = entry.querySelectorAll(selectors.author);

    if (authors.length > 1) {
      data.authors = Array.prototype.map.apply(authors, a => a.innerText).join('; ');
    } else if (authors.length === 1) {
      data.authors = authors[0].innerText;
    } else {
      data.authors = [];
    }

    if (translation) {
      data.translation = entry.querySelector(selectors.translation.selector).innerText?.match(translation)?.[1];
    }
    const lang = entry.querySelector(selectors.lang.selector);

    if (lang.innerText) {
      data.lang = lang.innerText.match(selectors.lang.regexp)?.[1];
    }

    const size = entry.querySelector(selectors.size.selector);

    if (size.innerText) {
      data.size = size.innerText.match(selectors.size.regexp)?.[1];
    }

    return data;
  });

  return books;
}

export async function searchHandler(query) {
  const search = config.search;

  let url = search.path;

  const params = { ...search.params };

  if (search.query.type === 'query') {
    params[search.query.name] = query;
  } else {
    url = url.replace('{{name}}', query);
  }

  url = url + querystring(params);

  try {
    const response = await fetch(url, { params });
    const body = await response.text();

    return { data: parseSearch(body, config.selectors, config.fileUrl) };
  } catch (e) {
    return { error: (e && e.message) || e };
  }
}
