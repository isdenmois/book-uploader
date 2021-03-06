import React, { useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'

import { preloadCookie } from 'entities/user'
import { preloadAddress } from 'entities/upload-address'
import { StatusBar, ThemeProvider } from 'shared/ui'

import { MainNavigator } from './navigation'

export const App = () => {
  useEffect(() => {
    preloadCookie()
    preloadAddress()
  }, [])

  return (
    <ThemeProvider>
      <NavigationContainer>
        <StatusBar />
        <MainNavigator />
      </NavigationContainer>
    </ThemeProvider>
  )
}
