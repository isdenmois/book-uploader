import React, { useMemo } from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import { useTheme } from 'shared/ui'
import { ScanScreen } from 'screens/scan'
import { DownloadModal } from 'screens/download.modal'

import { TabsNavigator } from './tabs-navigator'

const Stack = createStackNavigator()

export function MainNavigator() {
  const { colors } = useTheme()

  const s = useMemo(
    () => ({
      cardStyle: {
        backgroundColor: colors.background,
      },
    }),
    [colors],
  )

  return (
    <Stack.Navigator screenOptions={{ cardStyle: s.cardStyle }}>
      <Stack.Screen name='Tabs' component={TabsNavigator} options={{ headerShown: false }} />
      <Stack.Screen name='Scan' component={ScanScreen} options={modalOptions} />
      <Stack.Screen name='Download' component={DownloadModal} options={modalOptions} />
    </Stack.Navigator>
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
