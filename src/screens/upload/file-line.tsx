import React, { useCallback, memo } from 'react'
import { View } from 'react-native'
import RNFS from 'react-native-fs'
import { StyleSheet, TouchableOpacity } from 'react-native'
import FileOpener from 'react-native-file-opener'

import { EbookParser } from 'shared/native'
import { useRecoilValue } from 'recoil'
import { useConfirm, useSnapshotCallback } from 'shared/utils'
import { Text, ProgressBar, FileIcon, TimesIcon } from 'shared/ui'
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
    <View style={s.container}>
      <View style={s.line}>
        <TouchableOpacity
          style={s.row}
          onPress={shareFile}
          onLongPress={parseDisabled ? null : parseFile}
          disabled={touchDisabled}
        >
          <FileIcon size={34} color='uploadSelected' text={data.ext} />

          <View style={s.content}>
            {!error && !!author && (
              <Text style={s.secondary} color='secondary'>
                {author}
              </Text>
            )}
            <Text style={s.title} color='uploadText'>
              {data.title}
            </Text>
            {!!error && (
              <Text style={s.error} color='error'>
                {error}
              </Text>
            )}
          </View>
        </TouchableOpacity>

        {!touchDisabled && (
          <TouchableOpacity onPress={removeFile}>
            <TimesIcon />
          </TouchableOpacity>
        )}
      </View>

      <ProgressBar progress={error ? 0 : progress} color='uploadSelected' />
    </View>
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

const s = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  line: {
    flexDirection: 'row',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  content: {
    justifyContent: 'center',
    paddingLeft: 10,
    overflow: 'hidden',
    flex: 1,
  },
  title: {
    fontSize: 16,
  },
  secondary: {
    fontSize: 12,
  },
  error: {
    fontSize: 12,
  },
})
