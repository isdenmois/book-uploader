import React, { FC } from 'react'
import { useStore } from 'effector-react'
import { $dailyDownloads, dailyDownloadsFx, fetchDailyDownloads } from '../model'
import { View } from 'react-native'
import { ActivityIndicator, ProgressBar, Text } from 'shared/ui'
import { useFocusEffect } from '@react-navigation/native'

export const DailyDownloads: FC = () => {
  const { dailyDownloads, dailyDownloadsLimit, resetTime } = useStore($dailyDownloads)
  const isLoading = useStore(dailyDownloadsFx.pending)

  const progress = dailyDownloadsLimit > 0 ? Math.round((dailyDownloads / dailyDownloadsLimit) * 100) : 0
  const progressText = `${dailyDownloads} / ${dailyDownloadsLimit}`

  useFocusEffect(fetchDailyDownloads)

  return (
    <View>
      <Text mt={4} mb={1} textAlign='center' color='profileText'>
        Daily downloads {resetTime ? `(${resetTime})` : ''}
      </Text>

      {isLoading && <ActivityIndicator size='large' color='profileSelected' />}

      {!isLoading && <ProgressBar progress={progress} color='profileSelected' text={progressText} showAlways />}
    </View>
  )
}
