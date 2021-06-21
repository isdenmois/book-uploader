import React, { useCallback, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { useRecoilValueLoadable } from 'recoil'
import { Header } from './header'
import { BookList } from './book-list'
import { booksParams, booksSelector, extensionState, queryState, typeState } from './search.state'
import { useDeepLink, useSnapshotCallback } from 'shared/utils'
import { Box } from 'shared/ui'

export function SearchScreen() {
  const initQuery = useInitialQuery()
  const disabled = useRecoilValueLoadable(booksSelector).state === 'loading'
  const onSearch = useSnapshotCallback(({ get, set }) => {
    const type = get(typeState)
    const query = get(queryState)
    const extension = get(extensionState)

    set(booksParams, { type, query, extension })
  })

  return (
    <Box flex={1} backgroundColor='background'>
      <Header onSearch={onSearch} initQuery={initQuery} disabled={disabled} />
      <BookList />
    </Box>
  )
}

function useInitialQuery(): string {
  const [initQuery, setQuery] = useState<string>(null)
  const navigation = useNavigation()
  const onLink = useCallback(link => {
    if (link) {
      link = link.replace('booksearch://', '')
    }

    setQuery(link || '')
    navigation.navigate('search')
  }, [])

  useDeepLink(onLink)

  return initQuery
}
