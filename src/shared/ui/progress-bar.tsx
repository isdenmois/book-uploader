import React from 'react'
import { Box, Theme, Text } from './theme'

type Props = {
  color: keyof Theme['colors']
  progress?: number
  showAlways?: boolean
  text?: string
}

export function ProgressBar({ color, progress, showAlways, text }: Props) {
  if (!showAlways && (!progress || progress <= 0)) return <Box height={12} />
  const width = progress < 100 ? `${progress}%` : '100%'
  const isDone = progress >= 100

  return (
    <Box flexDirection='row' alignItems='center' height={12} marginTop={0.25}>
      <Box
        height={5}
        position='relative'
        backgroundColor='progressBackground'
        borderRadius={2}
        overflow='hidden'
        flex={1}
      >
        <Box
          position='absolute'
          left={0}
          top={0}
          bottom={0}
          width={width}
          backgroundColor={isDone ? 'success' : color}
        />
      </Box>

      <Text color='secondary' fontSize={12} lineHeight={12} pl={0.5} textAlign='right'>
        {text || Math.round(progress) + '%'}
      </Text>
    </Box>
  )
}
