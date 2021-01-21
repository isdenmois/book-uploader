import React from 'react';
import { View } from 'react-native';
import { DynamicStyleSheet, useDynamicStyleSheet } from 'react-native-dynamic';
import { useRecoilValue } from 'recoil';
import { dynamicColor } from 'theme/colors';
import { Login } from './login';
import { ProfileData } from './profile-data';
import { profileState } from './profile.state';

export function ProfileScreen() {
  const profile = useRecoilValue(profileState);
  const s = useDynamicStyleSheet(ds);

  return (
    <View style={s.container}>
      {!!profile && <ProfileData />}
      {!profile && <Login />}
    </View>
  );
}

const ds = new DynamicStyleSheet({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: dynamicColor.background,
  },
});
