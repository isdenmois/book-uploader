import React, { FC, useEffect } from 'react'
import { useStore } from 'effector-react'

import { $currentFile } from 'entities/download/model'
import { DownloadProgress } from 'entities/download/ui'
import { MainStackScreenProps } from 'shared/routes'
import { Box, Dialog, Text } from 'shared/ui'

type Props = MainStackScreenProps<'Download'>

export const DownloadModal: FC<Props> = ({ navigation }) => {
  const file = useStore($currentFile)

  useEffect(() => {
    if (!file) {
      navigation.goBack()
    }
  }, [file])

  if (!file) {
    return null
  }

  return (
    <Dialog>
      <Box px={3} pt={1} pb={2}>
        <Text variant='header'>Downloading</Text>
        <Text variant='secondary'>{file.title}</Text>

        <Box mt={1}>
          <DownloadProgress />
        </Box>
      </Box>
    </Dialog>
  )
}
