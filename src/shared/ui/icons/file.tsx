import * as React from 'react'
import Svg, { G, Path, Text } from 'react-native-svg'
import { useTheme } from '../theme'

function SvgComponent({ size, color, text }) {
  const { colors } = useTheme()

  return (
    <Svg viewBox='0 0 384 512' width={size} height={size} style={{ marginLeft: -4 }}>
      <G>
        <Path
          fill={colors[color]}
          d='M256 0H24A23.94 23.94 0 000 23.88V488a23.94 23.94 0 0023.88 24H360a23.94 23.94 0 0024-23.88V128H272a16 16 0 01-16-16z'
        />
        <Path
          fill={colors[color]}
          d='M384 121.9v6.1H272a16 16 0 01-16-16V0h6.1a24 24 0 0117 7l97.9 98a23.9 23.9 0 017 16.9z'
        />
      </G>

      <Text fill='white' fontSize='120' fontWeight='bold' x='192' y='440' textAnchor='middle'>
        {text.toUpperCase()}
      </Text>
    </Svg>
  )
}

export default SvgComponent
