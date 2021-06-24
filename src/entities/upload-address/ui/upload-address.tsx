import { useStore } from 'effector-react'
import React, { FC } from 'react'
import { Text } from 'shared/ui'
import { $uploadAdress } from '../model'

export const UploadAddress: FC = () => {
  const address = useStore($uploadAdress)
  if (!address) return null

  return <Text variant='secondary'>{address}</Text>
}
