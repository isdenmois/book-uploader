import React, { FC } from 'react'
import { TouchableOpacity, TouchableOpacityProps, useColorScheme } from 'react-native'
import {
  ThemeProvider as ReThemeProvider,
  createBox,
  createText,
  createTheme,
  useTheme as useThemeRN,
} from '@shopify/restyle'

import * as Colors from './colors'

export const theme = createTheme({
  spacing: {
    0.25: 2,
    0.5: 4,
    1: 8,
    2: 16,
    3: 24,
    4: 32,
    5: 40,
    6: 48,
  },
  colors: Colors.light,
  breakpoints: {},
  textVariants: {
    defaults: {
      fontSize: 16,
    },
    chip: {
      fontSize: 14,
      lineHeight: 18,
    },
    button_primary: {
      fontSize: 16,
      lineHeight: 22,
      color: 'invertedText',
    },
  },
  buttonVariants: {
    primary: {
      backgroundColor: 'profileSelected',
    },
  },
})

export type Theme = typeof theme

const darkTheme: Theme = {
  ...theme,
  colors: {
    ...theme.colors,
    ...Colors.dark,
  },
}

export const Box = createBox<Theme>()
export const Text = createText<Theme>()
export const TouchableBox = createBox<Theme, TouchableOpacityProps & { children: any }>(TouchableOpacity)

export const ThemeProvider: FC = ({ children }) => {
  const currentMode = useColorScheme()

  return <ReThemeProvider theme={currentMode === 'dark' ? darkTheme : theme}>{children}</ReThemeProvider>
}

export const useTheme = () => useThemeRN<Theme>()
