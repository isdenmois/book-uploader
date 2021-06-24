import React, { useEffect, useMemo } from 'react'
import { StatusBar, StatusBarStyle, useColorScheme } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import changeNavigationBarColor from 'react-native-navigation-bar-color'

import { useTheme } from 'shared/ui'
import { ScanScreen } from 'screens/scan'
import { DownloadModal } from 'screens/download.modal'

import { TabsNavigator } from './tabs-navigator'

const Stack = createStackNavigator()

export function MainNavigator() {
  const mode = useColorScheme()
  const { colors } = useTheme()
  const barStyle: StatusBarStyle = mode === 'dark' ? 'light-content' : 'dark-content'

  const s = useMemo(
    () => ({
      cardStyle: {
        backgroundColor: colors.background,
      },
    }),
    [mode],
  )

  useEffect(() => {
    changeNavigationBarColor(colors.tabsBackground, mode === 'light', false)
  }, [mode])

  return (
    <>
      <StatusBar backgroundColor={colors.background} barStyle={barStyle} />

      <Stack.Navigator screenOptions={{ cardStyle: s.cardStyle }}>
        <Stack.Screen name='Tabs' component={TabsNavigator} options={{ headerShown: false }} />
        <Stack.Screen name='Scan' component={ScanScreen} options={modalOptions} />
        <Stack.Screen name='Download' component={DownloadModal} options={modalOptions} />
      </Stack.Navigator>
    </>
  )
}

const modalOptions = {
  title: '',
  animationEnabled: false,
  headerShown: false,
  cardStyle: {
    backgroundColor: 'transparent',
  },
  cardOverlayEnabled: false,
}
