import React, { FC, useCallback } from 'react'
import { ToastAndroid } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useStore } from 'effector-react'

import { BookSearch } from 'features/search'
import { setQuery } from 'entities/search-filters'
import { downloadFileFx, $isDownloading } from 'entities/download'
import { confirm, useDeepLink } from 'shared/utils'
import { MainStackScreenProps } from 'shared/routes'
import { BookItem } from 'shared/api'

type Props = MainStackScreenProps<'Search'>

export const SearchScreen: FC<Props> = ({ navigation }) => {
  const isDownloading = useStore($isDownloading)

  useInitialQuery()

  const downloadBook = (book: BookItem) => {
    if (isDownloading) {
      ToastAndroid.show('Another download is in progress', ToastAndroid.SHORT)
    } else {
      confirm(book.title, 'Start download?', () => {
        downloadFileFx(book)
        navigation.push('Download')
      })
    }
  }

  return <BookSearch onDownload={downloadBook} onDownloadsOpen={() => navigation.push('Download')} />
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
