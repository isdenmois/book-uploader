import React, { useCallback } from 'react'
import { StyleSheet, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useRecoilValue } from 'recoil'
import { QrIcon } from 'shared/ui/icons'
import { addressState } from 'entities/upload-address'
import { uploadState, UPLOAD_STATE } from './upload.state'
import { Text } from 'shared/ui'

const titles: Record<UPLOAD_STATE, string> = {
  SCAN: 'Upload',
  IDLE: 'Upload',
  UPLOAD: 'Uploading',
  HAS_ERRORS: 'Ulpload with errors',
  FINISH: 'Uploaded',
}

export function UploadHeader() {
  const state = useRecoilValue(uploadState)
  const address = useRecoilValue(addressState)
  const navigation = useNavigation()
  const openQrScanner = useCallback(() => navigation.navigate('scan', { scan: true }), [])

  return (
    <View style={s.container}>
      <View style={s.titleRow}>
        <Text style={s.title} color='uploadText'>
          {titles[state]}
        </Text>
        <Text style={s.address} color='secondary'>
          {address}
        </Text>
      </View>

      {state === 'IDLE' && <QrIcon size={25} color='uploadText' onPress={openQrScanner} />}
    </View>
  )
}

const s = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingTop: 20,
    paddingLeft: 15,
    paddingRight: 15,
    alignItems: 'center',
  },
  titleRow: {
    flex: 1,
  },
  title: {
    fontSize: 24,
  },
  address: {
    fontSize: 12,
  },
})
