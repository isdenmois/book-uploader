import React from 'react'
import { act, fireEvent, render } from '@testing-library/react-native'

import { BookItem } from 'shared/api'
import { ThemeProvider } from 'shared/ui'

import { BookList } from '../book-list'

test('BookItem', async () => {
  const books: BookItem[] = [
    { ext: 'epub', type: 'ZLIB', title: 'First result', link: 'http://example.com' },
    { ext: 'epub', type: 'ZLIB', title: 'Second', link: 'http://ex.com' },
    { ext: 'epub', type: 'ZLIB', title: 'Third res', link: 'http://q.com' },
  ]
  const onDownload = jest.fn()

  const { rerender, toJSON, findAllByTestId, unmount } = render(
    <BookList books={null} isLoading onDownload={onDownload} />,
    {
      wrapper: ThemeProvider,
    },
  )

  expect(toJSON()).toMatchSnapshot()

  rerender(<BookList books={null} isLoading={false} onDownload={onDownload} />)
  expect(toJSON()).toMatchSnapshot()

  rerender(<BookList books={books} isLoading={false} onDownload={onDownload} />)
  expect(toJSON()).toMatchSnapshot()

  fireEvent.press((await findAllByTestId('book-item'))[0])

  expect(onDownload).toHaveBeenCalledWith(books[0])

  await act(async () => {
    unmount()
  })
})
