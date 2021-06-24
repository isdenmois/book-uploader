import React, { useEffect } from 'react'
import { StatusBar as RNStatusBar, StatusBarStyle, useColorScheme } from 'react-native'
import changeNavigationBarColor from 'react-native-navigation-bar-color'

import { useTheme } from './theme'

export const StatusBar = () => {
  const mode = useColorScheme()
  const { colors } = useTheme()
  const barStyle: StatusBarStyle = mode === 'dark' ? 'light-content' : 'dark-content'

  useEffect(() => {
    changeNavigationBarColor(colors.tabsBackground, mode === 'light', false)
  }, [colors, mode])

  return <RNStatusBar backgroundColor={colors.background} barStyle={barStyle} />
}
