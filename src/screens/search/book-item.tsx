import React, { useState } from 'react'
import { slugify } from 'transliteration'
import { ToastAndroid } from 'react-native'

import { useConfirm } from 'shared/utils'
import { BookItem as IBookItem } from 'shared/api/types'
import { Item, FileIcon, ProgressBar } from 'shared/ui'
import * as api from 'shared/api/book-download'

type Props = {
  item: IBookItem
}

export function BookItem({ item }: Props) {
  const [progress, onPress] = useDownload(item)
  const other = [item.size, item.lang, item.translation].filter(p => p).join(', ')

  return (
    <Item
      mb={3}
      onPress={onPress}
      testID='book-item'
      progress={<ProgressBar progress={progress} color='searchSelected' />}
    >
      <FileIcon size={40} color='searchSelected' text={item.ext.replace('.zip', '')} />

      <Item.Text suptitle={item.authors} title={item.title} subtitle={other} />
    </Item>
  )
}

export function useDownload(file: IBookItem) {
  const [progress, setProgress] = useState(0)
  const title = slugify(file.title).slice(0, 100)
  const fileName = `${title}.${file.ext}`

  const onPress = useConfirm(fileName, 'Start download?', async () => {
    ToastAndroid.show('Start downloading', ToastAndroid.SHORT)

    try {
      await api.downloadFile(file, fileName, setProgress)

      ToastAndroid.show(`File ${fileName} has downloaded!`, ToastAndroid.SHORT)
    } catch (e) {
      console.error(e?.message || e)
      ToastAndroid.show(`Error: ${e?.message || e}`, ToastAndroid.SHORT)
    }

    setProgress(0)
  })

  return [progress, onPress] as const
}
