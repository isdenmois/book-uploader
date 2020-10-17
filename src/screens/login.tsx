import { sendLogin, setCookie } from 'services/api';
import React, { useState } from 'react';
import { Alert, Button, TextInput, ToastAndroid, View } from 'react-native';

export function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const login = async () => {
    setLoading(true);

    try {
      const cookie = await sendLogin(email, password);

      if (!cookie) throw 'Unable to login with that data';

      await setCookie(cookie);

      setEmail('');
      setPassword('');
      ToastAndroid.show('Successfully login', ToastAndroid.SHORT);
    } catch (e) {
      Alert.alert('Error', e?.message || e?.toString() || e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder='e-mail'
        keyboardType='email-address'
        textContentType='emailAddress'
        autoFocus
        editable={!loading}
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder='password'
        textContentType='password'
        editable={!loading}
        onSubmitEditing={email && password ? login : null}
      />

      <Button title='Login' onPress={login} disabled={!email || !password || loading} />
    </View>
  );
}
