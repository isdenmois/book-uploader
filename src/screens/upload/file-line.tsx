import React, { useCallback, memo } from 'react'
import RNFS from 'react-native-fs'
import { TouchableOpacity } from 'react-native'
import FileOpener from 'react-native-file-opener'

import { EbookParser } from 'shared/native'
import { useRecoilValue } from 'recoil'
import { useConfirm, useSnapshotCallback } from 'shared/utils'
import { ProgressBar, FileIcon, TimesIcon, Item } from 'shared/ui'
import { fileFamily, filesState, UPLOAD_STATE } from './upload.state'

type Props = {
  id: string
  state: UPLOAD_STATE
}

export const FileLine = memo(({ id, state }: Props) => {
  const data = useRecoilValue(fileFamily(id))
  const parseFile = useParse(id)
  const shareFile = useShare(data.path)
  const removeFile = useRemove(id)

  const { progress, author, error } = data
  const touchDisabled = state !== 'IDLE'
  const parseDisabled = touchDisabled || data.isParsed

  return (
    <Item
      mb={3}
      onPress={shareFile}
      onLongPress={parseDisabled ? null : parseFile}
      disabled={touchDisabled}
      progress={<ProgressBar progress={error ? 0 : progress} color='uploadSelected' />}
    >
      <FileIcon size={34} color='uploadSelected' text={data.ext} />

      <Item.Text suptitle={author} title={data.title} error={error} />

      {!touchDisabled && (
        <TouchableOpacity onPress={removeFile}>
          <TimesIcon />
        </TouchableOpacity>
      )}
    </Item>
  )
})

export function useParse(id: string) {
  return useSnapshotCallback(async ({ get, merge }) => {
    const fileId = fileFamily(id)
    const data = get(fileId)

    const parsed = await EbookParser.getMetadata(data.path)

    merge(fileId, {
      path: parsed.file.filepath,
      title: parsed.title,
      author: parsed.author,
      isParsed: true,
    })
  })
}

export function useShare(path: string) {
  return useCallback(() => {
    const mime = path.endsWith('epub') ? 'application/epub' : 'application/fb2'

    FileOpener.open(path, mime)
  }, [path])
}

export function useRemove(id: string) {
  const data = useRecoilValue(fileFamily(id))
  const removeFile = useSnapshotCallback(async ({ get, set }) => {
    const file = get(fileFamily(id))

    await RNFS.unlink(file.path)

    set(filesState, files => files.filter(f => f !== id))
  }, [])

  return useConfirm('Remove file?', data.title || data.id, removeFile)
}
