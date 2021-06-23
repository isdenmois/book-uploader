import React from 'react'
import { useStore } from 'effector-react'

import { ProgressBar, Text } from 'shared/ui'
import { $progress } from '../model'

export const DownloadProgress = () => {
  const progress = useStore($progress)
  if (progress < 0) {
    return null
  }

  if (progress === 0) {
    return <Text variant='secondary'>Connection...</Text>
  }

  return <ProgressBar progress={progress} color='searchSelected' />
}
