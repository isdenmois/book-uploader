import React, { FC } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import { useList, useStore } from 'effector-react'

import { FileItem, shareFile } from 'entities/file'
import { $files, $uploadState, fetchFiles, parseFile, removeFile } from '../model'

export const UploadList: FC = () => {
  const state = useStore($uploadState)

  useFocusEffect(fetchFiles)

  return useList($files, file => (
    <FileItem file={file} disabled={state !== 'IDLE'} onParse={parseFile} onRemove={removeFile} onShare={shareFile} />
  ))
}
