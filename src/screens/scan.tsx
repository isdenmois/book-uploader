import React, { useState } from 'react';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import { ParamListBase } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Text, View } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { dynamicColor, useSColor } from 'theme/colors';
import { Dialog } from 'components/dialog';
import { addressState } from 'services/address';
import { SuccessIcon } from 'components/icons';
import { DynamicStyleSheet } from 'react-native-dynamic';

type Props = {
  navigation: StackNavigationProp<ParamListBase>;
};

export function ScanScreen({ navigation }: Props) {
  const [success, setSuccess] = useState(false);
  const address = useRecoilValue(addressState);
  const { s, color } = useSColor(ds);

  const onScan = useRecoilCallback(
    ({ set }) => ({ data }) => {
      if (!data) return;

      set(addressState, data.replace('http://', '').replace(/:\d+$/, ''));
      setSuccess(true);

      setTimeout(() => navigation.goBack(), 2000);
    },
    [],
  );

  return (
    <Dialog>
      {success && (
        <View style={[s.camera, s.success]}>
          <SuccessIcon size={100} color={color.success} />
          <Text style={s.address}>{address}</Text>
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
  );
}

const ds = new DynamicStyleSheet({
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
  address: {
    color: dynamicColor.uploadText,
    fontSize: 20,
  },
});
