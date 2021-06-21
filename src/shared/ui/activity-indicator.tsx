import React, { FC } from 'react'
import { ActivityIndicator as RNActivityIndicator, ActivityIndicatorProps } from 'react-native'
import { Theme, useTheme } from './theme'

type Props = ActivityIndicatorProps & {
  color: keyof Theme['colors']
}

export const ActivityIndicator: FC<Props> = ({ color, ...props }) => {
  const { colors } = useTheme()

  return <RNActivityIndicator {...props} color={colors[color]} />
}
