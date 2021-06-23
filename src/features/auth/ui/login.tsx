import React, { FC } from 'react'

import { Box } from 'shared/ui'
import { AuthButton } from './auth-button'
import { AuthForm } from './auth-form'

export const Login: FC = () => {
  return (
    <Box flex={1} justifyContent='center'>
      <AuthForm />

      <AuthButton />
    </Box>
  )
}
