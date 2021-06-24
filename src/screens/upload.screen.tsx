import React, { FC } from 'react'
import { useStore } from 'effector-react'

import { MainStackScreenProps } from 'shared/routes'
import { Box, QrIcon, Text } from 'shared/ui'
import { UPLOAD_STATE } from 'entities/file'
import { $uploadAdress } from 'entities/upload-address'
import { $uploadState, UploadButton, UploadList } from 'features/upload-files'

type Props = MainStackScreenProps<'Upload'>

const titles: Record<UPLOAD_STATE, string> = {
  SCAN: 'Upload',
  IDLE: 'Upload',
  UPLOAD: 'Uploading',
  HAS_ERRORS: 'Ulpload with errors',
  FINISH: 'Uploaded',
}

export const UploadScreen: FC<Props> = ({ navigation }) => {
  const address = useStore($uploadAdress)
  const state = useStore($uploadState)
  const openQrScanner = () => navigation.navigate('Scan', { scan: true })

  return (
    <Box flex={1} px={2} pt={3} backgroundColor='background'>
      <Box flexDirection='row' alignItems='center'>
        <Box flex={1}>
          <Text variant='header' color='uploadText'>
            {titles[state]}
          </Text>

          <Text variant='secondary'>{address}</Text>
        </Box>

        {state === 'IDLE' && <QrIcon size={25} color='uploadText' onPress={openQrScanner} />}
      </Box>

      <Box mt={2}>
        <UploadList />
      </Box>

      <UploadButton />
    </Box>
  )
}
