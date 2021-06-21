import React, { useState } from 'react'
import { sendLogin } from 'shared/api'
import { INITIAL_EMAIL, INITIAL_PASSWORD } from '@env'
import { Alert, StyleSheet, ToastAndroid, View } from 'react-native'
import { atom, selector, useRecoilValue } from 'recoil'
import { useSnapshotCallback } from 'shared/utils'
import { Box, Button, Input, Text, useNextInput } from 'shared/ui'
import { profileState } from './profile.state'
import { EmailIcon, KeyIcon } from 'shared/ui/icons'

const emailState = atom({ key: 'email', default: INITIAL_EMAIL })
const passwordState = atom({ key: 'password', default: INITIAL_PASSWORD })
const allowLoginSelector = selector({
  key: 'allowLogin',
  get({ get }) {
    const email = get(emailState)
    const password = get(passwordState)

    return Boolean(email && password)
  },
})

export function Login() {
  const [next, goToNext] = useNextInput()
  const { loading, allowLogin, login } = useLogin()
  const disabled = !allowLogin || loading

  return (
    <View style={s.container}>
      <View>
        <Text style={s.header} color='profileText'>
          Profile
        </Text>

        <Input
          state={emailState}
          textColor='profileText'
          icon={<EmailIcon />}
          placeholder='E-Mail'
          keyboardType='email-address'
          textContentType='emailAddress'
          onSubmit={goToNext}
          blurOnSubmit={false}
          returnKeyType='next'
          disabled={loading}
        />
        <Input
          state={passwordState}
          textColor='profileText'
          icon={<KeyIcon />}
          placeholder='Password'
          textContentType='password'
          onSubmitEditing={allowLogin ? login : null}
          textInputRef={next}
          returnKeyType='done'
          disabled={loading}
        />
      </View>

      <Box alignItems='center'>
        <Button label='Log In' onPress={login} loading={loading} disabled={disabled} />
      </Box>
    </View>
  )
}

export function useLogin() {
  const [loading, setLoading] = useState(false)
  const allowLogin = useRecoilValue(allowLoginSelector)

  const login = useSnapshotCallback(async ({ get, set, multiReset }) => {
    const email = get(emailState)
    const password = get(passwordState)

    setLoading(true)

    try {
      const cookie = await sendLogin(email, password)

      if (!cookie) throw 'Unable to login with that data'

      set(profileState, cookie)

      ToastAndroid.show('Successfully login', ToastAndroid.SHORT)
      multiReset(emailState, passwordState)
    } catch (e) {
      Alert.alert('Error', e?.message || e?.toString() || e)
    }

    setLoading(false)
  })

  return { loading, allowLogin, login }
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    fontSize: 24,
    marginTop: 20,
    marginHorizontal: 15,
  },
})
