import React, { useState } from 'react'
import { useRecoilCallback, useRecoilValue } from 'recoil'
import { ParamListBase } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { View } from 'react-native'
import { RNCamera } from 'react-native-camera'
import { Dialog } from 'shared/ui/dialog'
import { addressState } from 'entities/upload-address'
import { SuccessIcon } from 'shared/ui/icons'
import { Text } from 'shared/ui'
import { StyleSheet } from 'react-native'

type Props = {
  navigation: StackNavigationProp<ParamListBase>
}

export function ScanScreen({ navigation }: Props) {
  const [success, setSuccess] = useState(false)
  const address = useRecoilValue(addressState)

  const onScan = useRecoilCallback(
    ({ set }) => ({ data }) => {
      if (!data) return

      set(addressState, data.replace('http://', '').replace(/:\d+$/, ''))
      setSuccess(true)

      setTimeout(() => navigation.goBack(), 2000)
    },
    [],
  )

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
