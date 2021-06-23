import * as React from 'react'
import Svg, { Path } from 'react-native-svg'
import { useTheme } from '../theme'

function SvgComponent() {
  const { colors } = useTheme()

  return (
    <Svg viewBox='0 0 24 24' width={24} height={24}>
      <Path fill={colors.searchText} d='M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z' />
    </Svg>
  )
}

export default SvgComponent
