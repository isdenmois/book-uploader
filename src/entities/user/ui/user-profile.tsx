import React, { FC } from 'react'

import { Box, Button } from 'shared/ui'
import { logOut } from '../model'
import { DailyDownloads } from './daily-downloads'

interface Props {}

export const UserProfile: FC<Props> = ({}) => {
  return (
    <Box flex={1} justifyContent='space-between'>
      <DailyDownloads />

      <Box alignItems='center' mb={2}>
        <Button label='Log Out' onPress={logOut} />
      </Box>
    </Box>
  )
}
