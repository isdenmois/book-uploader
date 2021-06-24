import React, { useEffect, useMemo } from 'react'
import { RecoilRoot } from 'recoil'
import { StatusBar, StatusBarStyle, useColorScheme } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import changeNavigationBarColor from 'react-native-navigation-bar-color'

import { ScanScreen } from 'screens/scan'
import { MainScreen } from 'screens/main'
import { DownloadModal } from 'screens/download/download.modal'
import { preloadCookie } from 'entities/user'
import { preloadAddress } from 'entities/upload-address'
import { ThemeProvider, useTheme } from 'shared/ui'

const Stack = createStackNavigator()

const header = () => null

export const App = () => {
  useEffect(() => {
    preloadCookie()
    preloadAddress()
  }, [])

  return (
    <ThemeProvider>
      <RecoilRoot>
        <NavigationContainer>
          <StackNavigator />
        </NavigationContainer>
      </RecoilRoot>
    </ThemeProvider>
  )
}

function StackNavigator() {
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
        <Stack.Screen name='main' component={MainScreen} options={{ header }} />
        <Stack.Screen name='Scan' component={ScanScreen} options={modalOptions} />
        <Stack.Screen name='Download' component={DownloadModal} options={modalOptions} />
      </Stack.Navigator>
    </>
  )
}

const modalOptions = {
  title: '',
  animationEnabled: false,
  header,
  cardStyle: {
    backgroundColor: 'transparent',
  },
  cardOverlayEnabled: false,
}
