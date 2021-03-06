import React from 'react'
import { TouchableOpacity } from 'react-native'
import Svg, { Path } from 'react-native-svg'
import { useTheme } from '../theme'

type Props = {
  size: number
  color: string
  onPress?: () => void
}

export default function SvgComponent({ size, color, onPress }: Props) {
  const { colors } = useTheme()
  return (
    <TouchableOpacity style={{ paddingLeft: 10 }} onPress={onPress}>
      <Svg viewBox='0 0 512 512' width={size} height={size}>
        <Path
          fill={colors[color]}
          d='M0 224h192V32H0v192zM32 64h128v128H32V64zm224-32v192h192V32H256zm160 160H288V64h128v128zM0 480h192V288H0v192zm32-160h128v128H32V320zM64 96h64v64H64V96zm320 64h-64V96h64v64zM64 352h64v64H64v-64zm352-64h32v128H320v-32h-32v96h-32V288h96v32h64v-32zm0 160h32v32h-32v-32zm-64 0h32v32h-32v-32z'
        />
      </Svg>
    </TouchableOpacity>
  )
}
