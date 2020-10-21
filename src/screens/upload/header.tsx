import React, { useCallback } from 'react';
import { Text, View, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRecoilValue } from 'recoil';
import { QrIcon } from 'components/icons';
import { addressState } from 'services/address';
import * as colors from 'theme/colors';
import { uploadState, UPLOAD_STATE } from './upload.state';

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

  return (
    <View style={s.container}>
      <View style={s.titleRow}>
        <Text style={s.title}>{titles[state]}</Text>
        <Text style={s.address}>{address}</Text>
      </View>

      {state === 'IDLE' && <QrIcon size={25} color={colors.UploadText} onPress={openQrScanner} />}
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingTop: 20,
    paddingLeft: 15,
    paddingRight: 15,
    alignItems: 'center',
  } as ViewStyle,
  titleRow: {
    flex: 1,
  } as ViewStyle,
  title: {
    fontSize: 24,
    color: colors.UploadText,
  } as TextStyle,
  address: {
    color: colors.Secondary,
    fontSize: 12,
  } as TextStyle,
});
