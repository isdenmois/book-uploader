import React, { FC } from 'react'
import { ToastAndroid } from 'react-native'
import { useStore } from 'effector-react'

import { BookSearch } from 'features/search'
import { downloadFileFx, $isDownloading } from 'entities/download'
import { confirm } from 'shared/utils'
import { MainStackScreenProps } from 'shared/routes'
import { BookItem } from 'shared/api'

type Props = MainStackScreenProps<'Search'>

export const SearchScreen: FC<Props> = ({ navigation }) => {
  const isDownloading = useStore($isDownloading)

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
