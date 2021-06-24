import React from 'react'
import { useStore } from 'effector-react'

import { Login } from 'features/auth/ui'
import { $hasCookie, UserProfile } from 'entities/user'

import { Box, Text } from 'shared/ui'

export function ProfileScreen() {
  const hasCookie = useStore($hasCookie)

  return (
    <Box flex={1} backgroundColor='background' px={2} pt={3}>
      <Text variant='header' color='profileText'>
        Profile
      </Text>

      {hasCookie && <UserProfile />}

      {!hasCookie && <Login />}
    </Box>
  )
}
