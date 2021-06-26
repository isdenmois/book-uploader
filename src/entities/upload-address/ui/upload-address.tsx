import React, { FC } from 'react'
import { useStore } from 'effector-react'

import { Text } from 'shared/ui'
import { $uploadAddress } from '../model'

export const UploadAddress: FC = () => {
  const address = useStore($uploadAddress)
  if (!address) return null

  return (
    <Text variant='secondary' testID='uploadAddress'>
      {address}
    </Text>
  )
}
