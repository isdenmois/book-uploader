/**
 * @jest-environment jsdom
 */
import { render } from 'solid-testing-library'
import '@testing-library/jest-dom'

import { BookItem } from './book-item'

describe('<SearchChips />', () => {
  it('should render icon when book has no image', () => {
    const { container } = render(() => (
      <BookItem book={{ link: '', ext: '', title: '', type: 'FLIBUSTA' }} onDownload={() => {}} />
    ))

    expect(container.getElementsByTagName('svg')[0]).toBeInTheDocument()
    expect(container.getElementsByTagName('img').length).toBeFalsy()
  })

  it('should render thumbnail when book has an image', () => {
    const { container } = render(() => (
      <BookItem book={{ link: '', ext: '', title: '', type: 'ZLIB', imageUrl: '/1.jpg' }} onDownload={() => {}} />
    ))

    expect(container.getElementsByTagName('svg').length).toBeFalsy()
    expect(container.getElementsByTagName('img')[0]).toBeInTheDocument()
  })
})
