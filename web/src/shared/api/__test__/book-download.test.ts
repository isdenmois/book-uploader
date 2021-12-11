/**
 * @jest-environment jsdom
 */

import { mockCreateElement, mockLocalStorageGetItem } from 'shared/test-utils'

import * as tor from '../tor-request'
import { API_CONFIG } from '../config'
import { downloadFile } from '../book-download'

describe('downloadFile', () => {
  beforeEach(() => {
    API_CONFIG.ZLIB_HOST = 'http://zlib.com'
    API_CONFIG.FLIBUSTA_HOST = 'http://fb.com'
    mockLocalStorageGetItem('goodkuka')
  })

  it('from FLIBUSTA', async () => {
    const element = mockCreateElement<HTMLLinkElement>({ click: jest.fn() })

    await downloadFile({ type: 'FLIBUSTA', link: '/hp7.epub', ext: 'epub', title: 'HP7' })

    expect(element.href).toBe('/api/rewrite?host=http%3A%2F%2Ffb.com&path=%2Fhp7.epub')
    expect(element.click).toHaveBeenCalled()
  })

  it('from ZLIB', async () => {
    const element = mockCreateElement<HTMLLinkElement>({ click: jest.fn() })

    jest
      .spyOn(tor, 'request')
      .mockResolvedValue('<div><a class="addDownloadedBook" href="/dld/hp11-special.pdf"></a></div>')

    await downloadFile({ type: 'ZLIB', link: '/hp11.pdf', ext: 'pdf', title: 'HP11' })

    expect(element.href).toBe(
      '/api/rewrite?nofollow=true&cookie=goodkuka&host=http%3A%2F%2Fzlib.com&path=%2Fdld%2Fhp11-special.pdf',
    )
    expect(element.click).toHaveBeenCalled()
  })
})
