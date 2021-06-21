import React, { useEffect } from 'react'
import { RecoilRoot } from 'recoil'
import { StatusBar, StatusBarStyle, useColorScheme } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import changeNavigationBarColor from 'react-native-navigation-bar-color'

import { ScanScreen } from 'screens/scan'
import { MainScreen } from 'screens/main'
import { ThemeProvider, useTheme } from 'shared/ui'
import { useMemo } from 'react'

const Stack = createStackNavigator()

const header = () => null

export const App = () => {
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
      modalCardStyle: {
        backgroundColor: 'transparent',
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
        <Stack.Screen
          name='scan'
          component={ScanScreen}
          options={{
            title: '',
            animationEnabled: false,
            header,
            cardStyle: s.modalCardStyle,
            cardOverlayEnabled: false,
          }}
        />
      </Stack.Navigator>
    </>
  )
}
