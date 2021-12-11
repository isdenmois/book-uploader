/**
 * @jest-environment jsdom
 */
import { fireEvent, render, screen } from 'solid-testing-library'
import '@testing-library/jest-dom'
import { mockPromise } from 'shared/test-utils'

import { api } from 'shared/api'
import { SearchPage } from './search-page'

test('<SearchPage/>', async () => {
  jest.spyOn(api, 'downloadFile').mockResolvedValue()
  const [resolve] = mockPromise(api, 'bookSearch')
  render(() => <SearchPage />)

  fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'Harry Potter' } })
  fireEvent.submit(screen.getByRole('searchbox'))

  expect(screen.getByRole('progressbar')).toBeInTheDocument()
  const books = [
    { type: 'FLIBUSTA', link: '/hp1.epub', ext: 'epub', title: 'Harry Potter 1' },
    { type: 'FLIBUSTA', link: '/hp2.epub', ext: 'epub', title: 'Harry Potter 2' },
    { type: 'FLIBUSTA', link: '/supa-book.epub', ext: 'epub', title: 'Supa Pupa' },
  ]

  await resolve(books)

  expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()

  fireEvent.click(screen.getByRole('listitem', { name: 'Supa Pupa' }))

  expect(api.downloadFile).toHaveBeenCalledWith(books[2])
})
