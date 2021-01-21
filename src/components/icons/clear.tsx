import * as React from 'react';
import { useColor } from 'theme/colors';
import Svg, { Path } from 'react-native-svg';

function SvgComponent() {
  const color = useColor();

  return (
    <Svg viewBox='0 0 320 512' width={24} height={24}>
      <Path
        fill={color.deleteButton}
        d='M207.6 256l107.72-107.72c6.23-6.23 6.23-16.34 0-22.58l-25.03-25.03c-6.23-6.23-16.34-6.23-22.58 0L160 208.4 52.28 100.68c-6.23-6.23-16.34-6.23-22.58 0L4.68 125.7c-6.23 6.23-6.23 16.34 0 22.58L112.4 256 4.68 363.72c-6.23 6.23-6.23 16.34 0 22.58l25.03 25.03c6.23 6.23 16.34 6.23 22.58 0L160 303.6l107.72 107.72c6.23 6.23 16.34 6.23 22.58 0l25.03-25.03c6.23-6.23 6.23-16.34 0-22.58L207.6 256z'
      />
    </Svg>
  );
}

export default SvgComponent;
