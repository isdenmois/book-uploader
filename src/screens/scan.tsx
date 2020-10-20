import React from 'react';
import { useRecoilCallback } from 'recoil';
import { ParamListBase } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { addressState } from 'services/address';

type Props = {
  navigation: StackNavigationProp<ParamListBase>;
};

export function ScanScreen({ navigation }: Props) {
  const onScan = useRecoilCallback(
    ({ set }) => ({ data }) => {
      if (!data) return;

      set(addressState, data.replace('http://', '').replace(/:\d+$/, ''));
      navigation.goBack();
    },
    [],
  );

  return (
    <View style={s.cameraRow}>
      <RNCamera
        style={s.camera}
        type={RNCamera.Constants.Type.back}
        captureAudio={false}
        onBarCodeRead={onScan}
        onFacesDetected={null}
        onTextRecognized={null}
        testID='scan-camera'
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  } as ViewStyle,
  spacer: {
    height: 30,
  } as ViewStyle,
  cameraRow: {
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  camera: {
    width: 200,
    height: 200,
  } as ViewStyle,
});
