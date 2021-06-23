import React, { FC } from 'react'
import { useStore } from 'effector-react'

import { BookList } from 'entities/book'
import { $searchFilters, SearchFilters } from 'entities/search-filters'
import { BookItem } from 'shared/api'
import { Box } from 'shared/ui'

import { $booksFound, fetchBookItemsFx } from '../model'

interface Props {
  onDownload(book: BookItem)
}

export const BookSearch: FC<Props> = ({ onDownload }) => {
  const books = useStore($booksFound)
  const isLoading = useStore(fetchBookItemsFx.pending)

  const onSearch = () => {
    const { type, query, extension } = $searchFilters.getState()

    fetchBookItemsFx({ type, query, extension })
  }

  return (
    <Box flex={1} backgroundColor='background'>
      <SearchFilters onSubmit={onSearch} />

      <BookList books={books} isLoading={isLoading} onDownload={onDownload} />
    </Box>
  )
}
