import React, { useState } from 'react';
import { sendLogin } from 'services/api';
import { INITIAL_EMAIL, INITIAL_PASSWORD } from '@env';
import { Alert, Text, ToastAndroid, TouchableOpacity, View } from 'react-native';
import { atom, selector, useRecoilValue } from 'recoil';
import { useSnapshotCallback } from 'utils/recoil';
import { dynamicColor, useSColor } from 'theme/colors';
import { Input, useNextInput } from 'components/input';
import { profileState } from './profile.state';
import { EmailIcon, KeyIcon } from 'components/icons';
import { DynamicStyleSheet } from 'react-native-dynamic';

const emailState = atom({ key: 'email', default: INITIAL_EMAIL });
const passwordState = atom({ key: 'password', default: INITIAL_PASSWORD });
const allowLoginSelector = selector({
  key: 'allowLogin',
  get({ get }) {
    const email = get(emailState);
    const password = get(passwordState);

    return Boolean(email && password);
  },
});

export function Login() {
  const { s, color } = useSColor(ds);
  const [next, goToNext] = useNextInput();
  const { loading, allowLogin, login } = useLogin();
  const disabled = !allowLogin || loading;

  return (
    <View style={s.container}>
      <View>
        <Text style={s.header}>Profile</Text>

        <Input
          state={emailState}
          textColor={color.profileText}
          icon={<EmailIcon />}
          placeholder='E-Mail'
          keyboardType='email-address'
          textContentType='emailAddress'
          onSubmit={goToNext}
          returnKeyType='next'
          disabled={loading}
        />
        <Input
          state={passwordState}
          textColor={color.profileText}
          icon={<KeyIcon />}
          placeholder='Password'
          textContentType='password'
          onSubmitEditing={allowLogin ? login : null}
          textInputRef={next}
          returnKeyType='done'
          disabled={loading}
        />
      </View>

      <TouchableOpacity style={disabled ? [s.button, s.buttonDisabled] : s.button} onPress={login} disabled={disabled}>
        <Text style={s.buttonText}>Log in</Text>
      </TouchableOpacity>
    </View>
  );
}

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const allowLogin = useRecoilValue(allowLoginSelector);

  const login = useSnapshotCallback(async ({ get, set, multiReset }) => {
    const email = get(emailState);
    const password = get(passwordState);

    setLoading(true);

    try {
      const cookie = await sendLogin(email, password);

      if (!cookie) throw 'Unable to login with that data';

      set(profileState, cookie);

      ToastAndroid.show('Successfully login', ToastAndroid.SHORT);
      multiReset(emailState, passwordState);
    } catch (e) {
      Alert.alert('Error', e?.message || e?.toString() || e);
    }

    setLoading(false);
  });

  return { loading, allowLogin, login };
}

const ds = new DynamicStyleSheet({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    fontSize: 24,
    color: dynamicColor.profileText,
    marginTop: 20,
    marginHorizontal: 15,
  },
  button: {
    alignSelf: 'center',
    backgroundColor: dynamicColor.profileSelected,
    paddingHorizontal: 32,
    paddingVertical: 10,
    borderRadius: 22,
    marginBottom: 20,
  },
  buttonDisabled: {
    backgroundColor: dynamicColor.secondaryBackground,
  },
  buttonText: {
    color: dynamicColor.invertedText,
    fontSize: 16,
  },
});
