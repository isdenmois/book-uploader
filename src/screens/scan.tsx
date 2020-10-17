import React, { useCallback, useContext } from 'react';
import { ParamListBase } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { AddressContext } from 'services/address';

type Props = {
  navigation: StackNavigationProp<ParamListBase>;
};

export function ScanScreen({ navigation }: Props) {
  const { setAddress } = useContext(AddressContext);

  const onScan = useCallback(({ data }) => {
    if (!data) return;

    setAddress(data.replace('http://', '').replace(/:\d+$/, ''));
    navigation.goBack();
  }, []);

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
