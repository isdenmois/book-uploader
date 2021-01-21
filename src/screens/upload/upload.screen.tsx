import React, { useCallback } from 'react';
import { View, ActivityIndicator } from 'react-native';
import RNFS from 'react-native-fs';
import { dynamicColor, useSColor } from 'theme/colors';
import { useFocusEffect } from '@react-navigation/native';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { FileLine } from './file-line';
import { filesState, uploadState } from './upload.state';
import { UploadHeader } from './header';
import { UploadButton } from './upload-button';
import { DynamicStyleSheet } from 'react-native-dynamic';

export function UploadScreen() {
  const files = useFiles();
  const state = useRecoilValue(uploadState);
  const { s, color } = useSColor(ds);

  return (
    <View style={s.container}>
      <UploadHeader />

      {state === 'SCAN' && <ActivityIndicator style={s.loader} size='large' color={color.uploadSelected} />}

      <View style={s.files}>
        {files.map(name => (
          <FileLine key={name} id={name} state={state} />
        ))}
      </View>

      <UploadButton />
    </View>
  );
}

const FILE_NAME = /\.(fb2|epub|fb2\.zip|zip)$/;

export function useFiles() {
  const [files, setFiles] = useRecoilState(filesState);
  const setUpload = useSetRecoilState(uploadState);

  useFocusEffect(
    useCallback(() => {
      setUpload('SCAN');

      RNFS.readDir(RNFS.DocumentDirectoryPath).then(result => {
        const newFiles = result.filter(f => f.name.match(FILE_NAME)).map(f => f.name);

        setFiles(newFiles);
        setUpload('IDLE');
      });
    }, []),
  );

  return files;
}

const ds = new DynamicStyleSheet({
  container: {
    flex: 1,
    backgroundColor: dynamicColor.background,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
  files: {
    flex: 1,
    marginTop: 15,
    paddingHorizontal: 15,
  },
});
