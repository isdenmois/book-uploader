/**
 * @jest-environment jsdom
 */

import { mockFetch } from 'shared/test-utils/async'

import { bookSearch } from '../book-search'
import { FLIBUSTA, ZLIB } from '../book-search/configs'

describe('bookSearch', () => {
  beforeAll(() => {
    FLIBUSTA.host = 'http://fb.com'
    ZLIB.host = 'http://zlib.com'
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('Flibusta', () => {
    it('Empty response', async () => {
      const fetch = mockFetch().resolveText('')
      const result = await bookSearch('FLIBUSTA', 'Harry Ptter', 'fb2')

      expect(fetch.spy.mock.calls[0][0]).toBe(
        '/api/rewrite?searchType=books&extension=fb2&searchTerm=Harry%20Ptter&host=http%3A%2F%2Ffb.com&path=%2Fopds%2Fsearch',
      )
      expect(result).toEqual([])
    })

    it('Response with boooks', async () => {
      const fetch = mockFetch().resolveText(`
        <entry>
          <link href="/1.fb2"></link>
          <author>
            <name>J. K. Rowling</name>
          </author>
          <title>Harry Potter and the Philosopher's Stone</title>
          <link href="/i/82/605182/cover.jpg" rel="http://opds-spec.org/image" type="image/jpeg" />
        </entry>
        <entry>
          <link href="/2.fb2"></link>
          <author>
            <name>J. K. Rowling</name>
          </author>
          <title>Гарри Поттер и тайная комната</title>
          <content>Перевод: Росмун&Язык: Русский& Размер: 1Мб  &</content>
        </entry>
        <entry>
          <author>
            <name>J. K. Rowling</name>
          </author>
        </entry>
      `)

      const result = await bookSearch('FLIBUSTA', 'Harry Potter', 'fb2')

      expect(fetch.spy.mock.calls[0][0]).toBe(
        '/api/rewrite?searchType=books&extension=fb2&searchTerm=Harry%20Potter&host=http%3A%2F%2Ffb.com&path=%2Fopds%2Fsearch',
      )
      expect(result).toEqual([
        {
          type: 'FLIBUSTA',
          link: '/1.fb2',
          authors: 'J. K. Rowling',
          title: "Harry Potter and the Philosopher's Stone",
          ext: 'fb2.zip',
          imageUrl: '/i/82/605182/cover.jpg',
        },
        {
          type: 'FLIBUSTA',
          link: '/2.fb2',
          authors: 'J. K. Rowling',
          title: 'Гарри Поттер и тайная комната',
          ext: 'fb2.zip',
          lang: 'Русский',
          translation: 'Росмун',
          size: '1Мб',
        },
      ])
    })
  })

  describe('ZLib', () => {
    beforeEach(() => {
      jest.spyOn(window.localStorage.__proto__, 'getItem').mockReturnValue('cococo')
    })

    it('Empty response', async () => {
      const fetch = mockFetch().resolveText('')
      const result = await bookSearch('ZLIB', 'Harry Ptter', 'epub')

      expect(fetch.spy.mock.calls[0][0]).toBe(
        '/api/rewrite?e=1&extension=epub&cookie=cococo&host=http%3A%2F%2Fzlib.com&path=%2Fs%2FHarry%20Ptter',
      )
      expect(result).toEqual([])
    })

    it('Response with boooks', async () => {
      const fetch = mockFetch().resolveText(`
      <body>
        <div id="searchResultBox">
          <div class="resItemBox">
            <div class="itemCover">
              <img class="cover" data-src="/hp.jpg" />
            </div>
            <h3 itemprop="name">
              <a href="/hp3.epub">
                Harry Potter and the Prisoner of Azkaban
              </a>
            </h3>

            <div class="authors">
              <a>J. K. Rowling</a>
              <a>Someone else</a>
            </div>

            <div class="property__file">
              <div class="property_value">EPUB, 10Mb</div>
            </div>

            <div class="property_language">
              Language: English
            </div>
          </div>
        </div>
      </body>
      `)
      const result = await bookSearch('ZLIB', 'Harry Potter', 'epub')

      expect(fetch.spy.mock.calls[0][0]).toBe(
        '/api/rewrite?e=1&extension=epub&cookie=cococo&host=http%3A%2F%2Fzlib.com&path=%2Fs%2FHarry%20Potter',
      )
      expect(result).toEqual([
        {
          type: 'ZLIB',
          link: '/hp3.epub',
          imageUrl: '/hp.jpg',
          authors: 'J. K. Rowling; Someone else',
          title: 'Harry Potter and the Prisoner of Azkaban',
          size: '10Mb',
          lang: 'English',
          ext: 'EPUB',
        },
      ])
    })
  })
})
