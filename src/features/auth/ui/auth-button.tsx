import React, { FC } from 'react'
import { useStore } from 'effector-react'

import { Box, Button } from 'shared/ui'
import { $isAuthValid, authFx } from '../model'

export const AuthButton: FC = () => {
  const isLoading = useStore(authFx.pending)
  const isValid = useStore($isAuthValid)
  const disabled = isLoading || !isValid

  return (
    <Box alignItems='center'>
      <Button label='Log In' onPress={() => authFx()} loading={isLoading} disabled={disabled} />
    </Box>
  )
}
