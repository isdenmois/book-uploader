import React, { useState } from 'react'
import { slugify } from 'transliteration'
import { View, TouchableOpacity, ToastAndroid } from 'react-native'
import * as api from 'shared/api/book-download'
import { FileIcon } from 'shared/ui/icons'
import { useConfirm } from 'shared/utils'
import { ProgressBar } from 'shared/ui/progress-bar'
import { BookItem as IBookItem } from 'shared/api/types'
import { StyleSheet } from 'react-native'
import { Text } from 'shared/ui'

type Props = {
  item: IBookItem
}

export function BookItem({ item }: Props) {
  const [progress, onPress] = useDownload(item)
  const other = [item.size, item.lang, item.translation].filter(p => p).join(', ')

  return (
    <TouchableOpacity style={s.container} onPress={onPress} testID='book-item'>
      <View style={s.row}>
        <FileIcon size={40} color='searchSelected' text={item.ext.replace('.zip', '')} />

        <View style={s.common}>
          <Text style={s.secondary} color='secondary'>
            {item.authors}
          </Text>
          <Text style={s.title} color='searchText'>
            {item.title}
          </Text>
          {!!other && <Text style={s.secondary}>{other}</Text>}
        </View>
      </View>

      <ProgressBar progress={progress} color='searchSelected' />
    </TouchableOpacity>
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

const s = StyleSheet.create({
  container: {
    marginBottom: 20,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
  },
  common: {
    marginLeft: 10,
    flex: 1,
  },
  title: {
    fontSize: 16,
  },
  secondary: {
    fontSize: 12,
  },
})
