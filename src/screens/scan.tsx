import React, { FC, useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { RNCamera } from 'react-native-camera'
import { useStore } from 'effector-react'

import { Dialog, SuccessIcon, Text } from 'shared/ui'
import { MainStackScreenProps } from 'shared/routes'
import { $uploadAddress, setAddress } from 'entities/upload-address'

type Props = MainStackScreenProps<'Upload'>

export const ScanScreen: FC<Props> = ({ navigation }) => {
  const [success, setSuccess] = useState(false)
  const address = useStore($uploadAddress)

  const onScan = ({ data }) => {
    if (!data) return

    setAddress(data.replace('http://', '').replace(/:\d+$/, ''))
    setSuccess(true)

    setTimeout(() => navigation.goBack(), 2000)
  }

  return (
    <Dialog>
      {success && (
        <View style={[s.camera, s.success]}>
          <SuccessIcon size={100} color='success' />

          <Text fontSize={20} color='uploadText'>
            {address}
          </Text>
        </View>
      )}

      {!success && (
        <RNCamera
          style={s.camera}
          type={RNCamera.Constants.Type.back}
          captureAudio={false}
          onBarCodeRead={onScan}
          onFacesDetected={null}
          onTextRecognized={null}
          testID='scan-camera'
        />
      )}
    </Dialog>
  )
}

const s = StyleSheet.create({
  camera: {
    width: 250,
    height: 250,
  },
  success: {
    paddingTop: 50,
    paddingBottom: 30,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
})
