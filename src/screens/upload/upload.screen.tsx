import React, { useCallback } from 'react'
import { StyleSheet, View } from 'react-native'
import RNFS from 'react-native-fs'
import { useFocusEffect } from '@react-navigation/native'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'

import { ActivityIndicator, Box } from 'shared/ui'

import { FileLine } from './file-line'
import { filesState, uploadState } from './upload.state'
import { UploadHeader } from './header'
import { UploadButton } from './upload-button'

export function UploadScreen() {
  const files = useFiles()
  const state = useRecoilValue(uploadState)

  return (
    <Box style={s.container} backgroundColor='background'>
      <UploadHeader />

      {state === 'SCAN' && <ActivityIndicator style={s.loader} size='large' color='uploadSelected' />}

      <View style={s.files}>
        {files.map(name => (
          <FileLine key={name} id={name} state={state} />
        ))}
      </View>

      <UploadButton />
    </Box>
  )
}

const FILE_NAME = /\.(fb2|epub|fb2\.zip|zip)$/

export function useFiles() {
  const [files, setFiles] = useRecoilState(filesState)
  const setUpload = useSetRecoilState(uploadState)

  useFocusEffect(
    useCallback(() => {
      setUpload('SCAN')

      RNFS.readDir(RNFS.DocumentDirectoryPath).then(result => {
        const newFiles = result.filter(f => f.name.match(FILE_NAME)).map(f => f.name)

        setFiles(newFiles)
        setUpload('IDLE')
      })
    }, []),
  )

  return files
}

const s = StyleSheet.create({
  container: {
    flex: 1,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
  files: {
    flex: 1,
    marginTop: 15,
    paddingHorizontal: 15,
  },
})
