import { sendLogin } from 'services/api';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextStyle, ToastAndroid, TouchableOpacity, View, ViewStyle } from 'react-native';
import { atom, selector, useRecoilValue } from 'recoil';
import { useSnapshotCallback } from 'utils/recoil';
import * as colors from 'theme/colors';
import { Input, useNextInput } from 'components/input';
import { profileState } from './profile.state';
import { EmailIcon, KeyIcon } from 'components/icons';

const emailState = atom({ key: 'email', default: '' });
const passwordState = atom({ key: 'password', default: '' });
const allowLoginSelector = selector({
  key: 'allowLogin',
  get({ get }) {
    const email = get(emailState);
    const password = get(passwordState);

    return Boolean(email && password);
  },
});

export function Login() {
  const [next, goToNext] = useNextInput();
  const { loading, allowLogin, login } = useLogin();
  const disabled = !allowLogin || loading;

  return (
    <View style={s.container}>
      <View>
        <Text style={s.header}>Profile</Text>

        <Input
          state={emailState}
          textColor={colors.ProfileText}
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
          textColor={colors.ProfileText}
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

const s = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  } as ViewStyle,
  header: {
    fontSize: 24,
    color: colors.ProfileText,
    marginTop: 20,
    marginHorizontal: 15,
  } as TextStyle,
  button: {
    alignSelf: 'center',
    backgroundColor: colors.ProfileSelected,
    paddingHorizontal: 32,
    paddingVertical: 10,
    borderRadius: 22,
    marginBottom: 20,
  } as ViewStyle,
  buttonDisabled: {
    backgroundColor: colors.SecondaryBackground,
  } as ViewStyle,
  buttonText: {
    color: colors.InvertedText,
    fontSize: 16,
  } as TextStyle,
});
