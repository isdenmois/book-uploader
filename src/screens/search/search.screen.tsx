import React, { useCallback } from 'react'
import { useNavigation } from '@react-navigation/native'

import { useDeepLink } from 'shared/utils'
import { Box } from 'shared/ui'
import { $query, $searchFilters, BookList, fetchBookItemsFx, SearchFilters, setQuery } from 'entities/search'

export function SearchScreen() {
  const onSearch = () => {
    const { type, extension } = $searchFilters.getState()
    const query = $query.getState()

    fetchBookItemsFx({ type, query, extension })
  }

  useInitialQuery()

  return (
    <Box flex={1} backgroundColor='background'>
      <SearchFilters onSubmit={onSearch} />

      <BookList
        onDownload={book => {
          console.log('Download', book)
        }}
      />
    </Box>
  )
}

function useInitialQuery() {
  const navigation = useNavigation()
  const onLink = useCallback(link => {
    if (link) {
      link = link.replace('booksearch://', '')
    }

    setQuery(link || '')
    navigation.navigate('search')
  }, [])

  useDeepLink(onLink)
}
