import React from 'react'
import { useRecoilValue } from 'recoil'

import { Box } from 'shared/ui'

import { Login } from './login'
import { ProfileData } from './profile-data'
import { profileState } from './profile.state'

export function ProfileScreen() {
  const profile = useRecoilValue(profileState)

  return (
    <Box flex={1} backgroundColor='background'>
      {!!profile && <ProfileData />}
      {!profile && <Login />}
    </Box>
  )
}
