import React, { FC } from 'react'
import { useStore } from 'effector-react'

import { BookList } from 'entities/book'
import { $searchFilters, SearchFilters } from 'entities/search-filters'
import { BookItem } from 'shared/api'
import { Box, DownloadIcon, TouchableBox } from 'shared/ui'

import { $booksFound, fetchBookItemsFx } from '../model'
import { $isDownloading } from 'entities/download'

interface Props {
  onDownload(book: BookItem)
  onDownloadsOpen()
}

export const BookSearch: FC<Props> = ({ onDownload, onDownloadsOpen }) => {
  const isDownloading = useStore($isDownloading)
  const books = useStore($booksFound)
  const isLoading = useStore(fetchBookItemsFx.pending)

  const onSearch = () => {
    const { type, query, extension } = $searchFilters.getState()

    fetchBookItemsFx({ type, query, extension })
  }

  return (
    <Box flex={1} backgroundColor='background'>
      <Box flexDirection='row'>
        <Box flex={1}>
          <SearchFilters onSubmit={onSearch} />
        </Box>

        {isDownloading && (
          <TouchableBox px={1} py={1} mt={2} onPress={onDownloadsOpen}>
            <DownloadIcon />
          </TouchableBox>
        )}
      </Box>

      <BookList books={books} isLoading={isLoading} onDownload={onDownload} />
    </Box>
  )
}
