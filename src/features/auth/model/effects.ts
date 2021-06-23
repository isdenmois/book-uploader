import { Alert, ToastAndroid } from 'react-native'
import { createEffect, forward } from 'effector'

import { sendLogin } from 'shared/api'
import { setCookie } from 'entities/user'
import { $email, $password } from './stores'

export const authFx = createEffect(async () => {
  const cookie = await sendLogin($email.getState(), $password.getState())

  if (!cookie) throw 'Unable to login with that data'

  ToastAndroid.show('Successfully login', ToastAndroid.SHORT)

  return cookie
})

authFx.failData.watch((error: any) => {
  Alert.alert('Error', error?.message || error?.toString() || error)
})

forward({ from: authFx.doneData, to: setCookie })
