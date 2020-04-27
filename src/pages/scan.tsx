import React, { useState, useEffect, useCallback } from 'react';
import { View, Button, StyleSheet, ViewStyle } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { RNCamera } from 'react-native-camera';
import { BASE } from 'utils/request';

function useAddress(navigation) {
  const [address, setAddress] = useState('');
  const changeAddress = useCallback(a => {
    if (a) {
      setAddress(a);
      navigation.setOptions({ title: a });
      AsyncStorage.setItem('address', a);
      BASE.URL = __DEV__ ? `http://${a}:4000` : `http://${a}:8080`;
    }
  }, []);

  useEffect(() => {
    AsyncStorage.getItem('address').then(changeAddress);
  }, []);

  return { address, changeAddress };
}

function useScan(navigation) {
  const { address, changeAddress } = useAddress(navigation);
  const [scan, setScan] = useState(false);

  const openScan = useCallback(() => setScan(true), []);
  const onScan = useCallback(({ data }) => {
    if (!data) return;

    setScan(false);
    changeAddress(data.replace('http://', '').replace(':8080', ''));
  }, []);

  return { address, scan, openScan, onScan };
}

export function ScanScreen({ navigation }) {
  const { address, scan, openScan, onScan } = useScan(navigation);

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
      {!!address && <Button title='Продолжить' onPress={() => navigation.push('home')} />}
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
