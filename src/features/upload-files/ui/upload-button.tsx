import React, { FC } from 'react'
import { useStore } from 'effector-react'

import { Button } from 'shared/ui'
import { $canStartUpload, startUpload } from '../model'

export const UploadButton: FC = () => {
  const canStartUpload = useStore($canStartUpload)

  if (!canStartUpload) return null

  return <Button label='Start upload' backgroundColor='uploadSelected' margin={2} onPress={startUpload} />
}
