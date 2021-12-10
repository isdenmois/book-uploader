import { API_CONFIG } from '../config'
import { getImageUrl } from '../book-image'

describe('getImageUrl', () => {
  beforeEach(() => {
    API_CONFIG.ZLIB_HOST = 'http://zlib.com'
    API_CONFIG.FLIBUSTA_HOST = 'http://fb.com'
  })

  it('should return empty value for FLIBUSTA source', () => {
    expect(getImageUrl('FLIBUSTA')).not.toBeDefined()
    expect(getImageUrl('FLIBUSTA')).not.toBeDefined()
    expect(getImageUrl('FLIBUSTA', '')).not.toBeDefined()
    expect(getImageUrl('FLIBUSTA', '/img.jpg')).toBe('/api/rewrite?host=http%3A%2F%2Ffb.com&path=%2Fimg.jpg')
  })

  it('should return an url for the ZLIB source', () => {
    expect(getImageUrl('ZLIB')).not.toBeDefined()
    expect(getImageUrl('ZLIB')).not.toBeDefined()
    expect(getImageUrl('ZLIB', '')).not.toBeDefined()
    expect(getImageUrl('ZLIB', '/img.jpg')).toBe('/api/rewrite?host=http%3A%2F%2Fzlib.com&path=%2Fimg.jpg')
  })
})
