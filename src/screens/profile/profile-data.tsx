import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { useSetRecoilState } from 'recoil'
import { Text } from 'shared/ui'
import { DailyDownloads } from './daily-downloads'
import { profileState } from './profile.state'

export function ProfileData() {
  const setProfile = useSetRecoilState(profileState)

  return (
    <View style={s.container}>
      <View>
        <Text style={s.header} color='profileText'>
          Profile
        </Text>

        <DailyDownloads />
      </View>

      <TouchableOpacity style={s.button} onPress={() => setProfile(null)}>
        <Text style={s.buttonText} color='profileText'>
          log out
        </Text>
      </TouchableOpacity>
    </View>
  )
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 15,
    justifyContent: 'space-between',
  },
  header: {
    fontSize: 24,
  },
  button: {
    alignSelf: 'center',
    marginBottom: 15,
  },
  buttonText: {
    fontSize: 16,
  },
})
