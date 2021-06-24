import React, { FC } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import { useList, useStore } from 'effector-react'

import { ActivityIndicator } from 'shared/ui'
import { FileItem, shareFile } from 'entities/file'
import { $files, $uploadState, fetchFiles, fetchFilesFx, parseFile, removeFile } from '../model'

export const UploadList: FC = () => {
  const isLoading = useStore(fetchFilesFx.pending)
  const state = useStore($uploadState)

  useFocusEffect(fetchFiles)

  const fileList = useList($files, file => (
    <FileItem file={file} disabled={state !== 'IDLE'} onParse={parseFile} onRemove={removeFile} onShare={shareFile} />
  ))

  if (isLoading) {
    return <ActivityIndicator color='uploadSelected' />
  }

  return fileList
}
