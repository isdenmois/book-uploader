import React from 'react';
import { StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { useSetRecoilState } from 'recoil';
import * as colors from 'theme/colors';
import { DailyDownloads } from './daily-downloads';
import { profileState } from './profile.state';

export function ProfileData() {
  const setProfile = useSetRecoilState(profileState);

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

const s = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 15,
    justifyContent: 'space-between',
  } as ViewStyle,
  header: {
    color: colors.ProfileText,
    fontSize: 24,
  } as TextStyle,
  button: {
    alignSelf: 'center',
    marginBottom: 15,
  } as ViewStyle,
  buttonText: {
    fontSize: 16,
    color: colors.ProfileText,
  } as TextStyle,
});
