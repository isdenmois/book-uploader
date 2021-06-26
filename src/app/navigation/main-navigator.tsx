import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import { ScanScreen } from 'screens/scan'
import { DownloadModal } from 'screens/download.modal'

import { TabsNavigator } from './tabs-navigator'

const Stack = createStackNavigator()

export function MainNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Group screenOptions={{ detachPreviousScreen: false }}>
        <Stack.Screen name='Tabs' component={TabsNavigator} options={{ headerShown: false }} />
      </Stack.Group>

      <Stack.Group screenOptions={modalOptions}>
        <Stack.Screen name='Scan' component={ScanScreen} />
        <Stack.Screen name='Download' component={DownloadModal} />
      </Stack.Group>
    </Stack.Navigator>
  )
}

const modalOptions: any = {
  detachPreviousScreen: false,
  presentation: 'modal',
  headerShown: false,
  cardStyle: {
    backgroundColor: 'transparent',
  },
  cardOverlayEnabled: false,
  cardShadowEnabled: false,

  cardStyleInterpolator: ({ current: { progress } }) => ({
    cardStyle: {
      opacity: progress.interpolate({
        inputRange: [0, 0.5, 0.9, 1],
        outputRange: [0, 0.1, 0.3, 1],
        extrapolate: 'clamp',
      }),
    },
  }),
}
