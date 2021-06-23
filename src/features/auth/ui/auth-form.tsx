import React, { FC } from 'react'
import { useStore } from 'effector-react'

import { EmailIcon, Input, KeyIcon, useNextInput } from 'shared/ui'
import { $email, $password, authFx, setEmail, setPassword } from '../model'

export const AuthForm: FC = () => {
  const [next, goToNext] = useNextInput()
  const email = useStore($email)
  const password = useStore($password)
  const isLoading = useStore(authFx.pending)

  const allowLogin = Boolean(email && password)

  return (
    <>
      <Input
        textColor='profileText'
        icon={<EmailIcon />}
        placeholder='E-Mail'
        keyboardType='email-address'
        textContentType='emailAddress'
        onSubmit={goToNext}
        blurOnSubmit={false}
        returnKeyType='next'
        disabled={isLoading}
        value={email}
        onChangeText={setEmail}
      />

      <Input
        textColor='profileText'
        icon={<KeyIcon />}
        placeholder='Password'
        textContentType='password'
        onSubmitEditing={allowLogin ? () => authFx() : null}
        textInputRef={next}
        returnKeyType='done'
        disabled={isLoading}
        value={password}
        onChangeText={setPassword}
      />
    </>
  )
}
