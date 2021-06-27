import React, { FC } from 'react'
import { TouchableOpacity } from 'react-native'

import { FileIcon, Item, ProgressBar, TimesIcon } from 'shared/ui'
import { useConfirm } from 'shared/utils'
import type { FileData } from '../model'

interface Props {
  file: FileData
  disabled?: boolean
  onRemove: (file: FileData) => void
  onParse: (file: FileData) => void
  onShare: (file: FileData) => void
}

export const FileItem: FC<Props> = ({ file, disabled, onRemove, onParse, onShare }) => {
  const parseDisabled = disabled || file.isParsed
  const removeFile = useConfirm('Remove file?', file.title || file.id, () => onRemove(file))

  return (
    <Item
      mb={3}
      onPress={() => onShare(file)}
      onLongPress={parseDisabled ? null : () => onParse(file)}
      disabled={disabled}
      progress={!file.error && <ProgressBar progress={file.progress} color='uploadSelected' />}
      testID={'file-item-' + file.id}
    >
      <FileIcon size={34} color='uploadSelected' text={file.ext} />

      <Item.Text suptitle={file.author} title={file.title} error={file.error} />

      {!disabled && (
        <TouchableOpacity onPress={removeFile} testID='removeFile'>
          <TimesIcon />
        </TouchableOpacity>
      )}
    </Item>
  )
}
