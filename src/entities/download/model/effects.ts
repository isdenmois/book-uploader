import { ToastAndroid } from 'react-native'
import { slugify } from 'transliteration'
import { createEffect } from 'effector'

import * as api from 'shared/api'
import { BookItem } from 'shared/api'
import { resetDownload, setCurrentFile, setProgress } from './events'

export const downloadFileFx = createEffect(async (file: BookItem) => {
  setCurrentFile(file)
  setProgress(0)

  const title = slugify(file.title).slice(0, 100)
  const fileName = `${title}.${file.ext}`

  ToastAndroid.show('Start downloading', ToastAndroid.SHORT)

  try {
    await api.downloadFile(file, fileName, setProgress)

    ToastAndroid.show(`File ${fileName} has downloaded!`, ToastAndroid.SHORT)
  } catch (e) {
    console.error(e?.message || e)
    ToastAndroid.show(`Error: ${e?.message || e}`, ToastAndroid.SHORT)
  }

  resetDownload()
})
