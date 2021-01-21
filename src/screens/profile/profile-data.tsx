import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { DynamicStyleSheet, useDynamicStyleSheet } from 'react-native-dynamic';
import { useSetRecoilState } from 'recoil';
import { dynamicColor } from 'theme/colors';
import { DailyDownloads } from './daily-downloads';
import { profileState } from './profile.state';

export function ProfileData() {
  const setProfile = useSetRecoilState(profileState);
  const s = useDynamicStyleSheet(ds);

  return (
    <View style={s.container}>
      <View>
        <Text style={s.header}>Profile</Text>

        <DailyDownloads />
      </View>

      <TouchableOpacity style={s.button} onPress={() => setProfile(null)}>
        <Text style={s.buttonText}>log out</Text>
      </TouchableOpacity>
    </View>
  );
}

const ds = new DynamicStyleSheet({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 15,
    justifyContent: 'space-between',
  },
  header: {
    color: dynamicColor.profileText,
    fontSize: 24,
  },
  button: {
    alignSelf: 'center',
    marginBottom: 15,
  },
  buttonText: {
    fontSize: 16,
    color: dynamicColor.profileText,
  },
});
