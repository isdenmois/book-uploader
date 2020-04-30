import React, { useState, useCallback, useContext, useEffect } from 'react';
import { View, Button, StyleSheet, ViewStyle } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { AddressContext } from 'utils/address';

function useAddress(navigation) {
  const { address, setAddress } = useContext(AddressContext);

  useEffect(() => {
    navigation.setOptions({ title: address });
  }, [address]);

  return { address, setAddress };
}

function useScan(navigation, initialScan) {
  const { address, setAddress } = useAddress(navigation);
  const [scan, setScan] = useState(initialScan);

  const openScan = useCallback(() => setScan(true), []);
  const onScan = useCallback(({ data }) => {
    if (!data) return;

    setScan(false);
    setAddress(data.replace('http://', '').replace(':8080', ''));
  }, []);

  return { address, scan, openScan, onScan };
}

export function ScanScreen({ navigation, route: { params } }) {
  const { address, scan, openScan, onScan } = useScan(navigation, params.scan);
  const onContinue = useCallback(() => (params.scan ? navigation.goBack() : navigation.push('home')), []);

  if (scan) {
    return (
      <View style={s.cameraRow}>
        <RNCamera
          style={s.camera}
          type={RNCamera.Constants.Type.back}
          captureAudio={false}
          onBarCodeRead={onScan}
          onFacesDetected={null}
          onTextRecognized={null}
        />
      </View>
    );
  }

  return (
    <View style={s.container}>
      <Button title='Сканировать' onPress={openScan} />
      <View style={s.spacer} />
      {!!address && <Button title='Продолжить' onPress={onContinue} />}
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
