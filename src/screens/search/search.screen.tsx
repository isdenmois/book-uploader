import React, { useCallback } from 'react'
import { useNavigation } from '@react-navigation/native'

import { BookSearch } from 'features/search'
import { setQuery } from 'entities/search-filters'
import { useDeepLink } from 'shared/utils'

export function SearchScreen() {
  useInitialQuery()

  return (
    <BookSearch
      onDownload={book => {
        console.log('Download', book)
      }}
    />
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
