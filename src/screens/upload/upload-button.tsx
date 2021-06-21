import React from 'react'
import RNFS from 'react-native-fs'
import { useRecoilValue } from 'recoil'

import { uploadFile } from 'shared/api/upload'
import { EbookParser } from 'shared/native'
import { addressState } from 'entities/upload-address'
import { useSnapshotCallback } from 'shared/utils'
import { Button } from 'shared/ui'
import { fileFamily, filesState, uploadState } from './upload.state'

export function UploadButton() {
  const isButtonVisible = useUploadVisible()
  const startUpload = useUpload()

  if (!isButtonVisible) return null

  return <Button label='Start upload' backgroundColor='uploadSelected' margin={2} onPress={startUpload} />
}

export function useUploadVisible() {
  const files = useRecoilValue(filesState)
  const state = useRecoilValue(uploadState)
  const address = useRecoilValue(addressState)

  return address && (state === 'IDLE' || state === 'HAS_ERRORS') && files?.length > 0
}

export function useUpload() {
  return useSnapshotCallback(async ({ get, set, merge }) => {
    const files = get(filesState)
    const address = get(addressState)
    let hasErrors = false

    set(uploadState, 'UPLOAD')

    for (let id of files) {
      const fileId = fileFamily(id)
      const setProgress = progress => merge(fileId, { progress })
      const file = get(fileId)

      if (file.isUploaded) continue

      // Set initial progress
      merge(fileId, { error: null, progress: 0.01 })

      try {
        const parsed = await EbookParser.getMetadata(file.path)

        // Update book data
        merge(fileId, { title: parsed.title, author: parsed.author, isParsed: true })

        await uploadFile(address, parsed.file, setProgress)

        // Remove file
        await RNFS.unlink(parsed.file.filepath)

        // Set upload status
        merge(fileId, { progress: 100, isUploaded: true })
      } catch (e) {
        hasErrors = true
        merge(fileId, { error: e?.responseText || e?.toString() })
        console.error(e)
      }
    }

    set(uploadState, hasErrors ? 'HAS_ERRORS' : 'FINISH')
  }, [])
}
