import React, { useCallback } from 'react';
import { Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRecoilValue } from 'recoil';
import { QrIcon } from 'components/icons';
import { addressState } from 'services/address';
import { dynamicColor, useSColor } from 'theme/colors';
import { uploadState, UPLOAD_STATE } from './upload.state';
import { DynamicStyleSheet } from 'react-native-dynamic';

const titles: Record<UPLOAD_STATE, string> = {
  SCAN: 'Upload',
  IDLE: 'Upload',
  UPLOAD: 'Uploading',
  HAS_ERRORS: 'Ulpload with errors',
  FINISH: 'Uploaded',
};

export function UploadHeader() {
  const state = useRecoilValue(uploadState);
  const address = useRecoilValue(addressState);
  const navigation = useNavigation();
  const openQrScanner = useCallback(() => navigation.navigate('scan', { scan: true }), []);
  const { s, color } = useSColor(ds);

  return (
    <View style={s.container}>
      <View style={s.titleRow}>
        <Text style={s.title}>{titles[state]}</Text>
        <Text style={s.address}>{address}</Text>
      </View>

      {state === 'IDLE' && <QrIcon size={25} color={color.uploadText} onPress={openQrScanner} />}
    </View>
  );
}

const ds = new DynamicStyleSheet({
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
    color: dynamicColor.uploadText,
  },
  address: {
    color: dynamicColor.secondary,
    fontSize: 12,
  },
});
