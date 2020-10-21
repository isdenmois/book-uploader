import React, { createContext, useState, useCallback, memo, useContext, useEffect, useRef } from 'react';
import { Alert, Text, View, StyleSheet, ActivityIndicator } from 'react-native';
import RNFS, { ReadDirItem } from 'react-native-fs';
import { uploadBook } from 'services/api/upload';
import { EbookParser, EbookMetadata } from 'services/book-parser';
import { ParseIcon, RemoveIcon, QrIcon, ShareIcon, FileIcon } from 'components/icons';
import { addressState } from 'services/address';
import { TouchableOpacity } from 'react-native-gesture-handler';
import * as colors from 'theme/colors';
import { useFocusEffect } from '@react-navigation/native';
import FileOpener from 'react-native-file-opener';
import { useRecoilValue } from 'recoil';
import { useSnapshotCallback } from 'utils/recoil';
import { FileData, fileFamily } from './upload.state';
import { ProgressBar } from 'components/progress-bar';

type Props = {
  id: string;
  state: any;
};

export const FileLine = memo(({ id, state }: Props) => {
  const data = useRecoilValue(fileFamily(id));
  const parseFile = useParse(id);
  const shareFile = useShare(data.path);
  const { progress, author, error } = data;
  const touchDisabled = state !== 'IDLE';
  const parseDisabled = touchDisabled || data.isParsed;

  return (
    <TouchableOpacity
      style={{ marginBottom: 15 }}
      onPress={shareFile}
      onLongPress={parseDisabled ? null : parseFile}
      disabled={touchDisabled}
    >
      <View style={{ flexDirection: 'row' }}>
        <FileIcon size={34} color={colors.UploadSelected} text={data.ext} />

        <View style={{ justifyContent: 'center' }}>
          {!error && !!author && <Text style={{ color: colors.Secondary, fontSize: 12 }}>{author}</Text>}
          <Text style={{ color: colors.UploadText, fontSize: 16 }}>{data.title}</Text>
          {!!error && <Text style={{ color: colors.Error, fontSize: 12 }}>{error}</Text>}
        </View>
      </View>

      <ProgressBar progress={error ? 0 : progress} color={colors.UploadSelected} />
    </TouchableOpacity>
  );
});

export function useParse(id: string) {
  return useSnapshotCallback(async ({ get, merge }) => {
    const fileId = fileFamily(id);
    const data = get(fileId);

    const parsed = await EbookParser.getMetadata(data.path);

    merge(fileId, {
      path: parsed.file.filepath,
      title: parsed.title,
      author: parsed.author,
      isParsed: true,
    });
  });
}

export function useShare(path: string) {
  return useCallback(() => {
    const mime = path.endsWith('epub') ? 'application/epub' : 'application/fb2';

    FileOpener.open(path, mime);
  }, [path]);
}

const s = StyleSheet.create({
  visible: {
    flex: 1,
  },
  hidden: {
    height: 0,
  },
  title: {
    flex: 1,
    fontSize: 18,
    textAlign: 'center',
  },
  files: {
    flex: 1,
    marginTop: 15,
    paddingHorizontal: 10,
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: colors.blue,
    paddingVertical: 12,
  },
  buttonText: {
    color: colors.invert,
    fontSize: 16,
  },
  progress: {
    position: 'relative',
    borderRadius: 10,
    marginTop: 5,
    height: 3,
    backgroundColor: colors.secondary,
  },
  progressLine: {
    position: 'absolute',
    backgroundColor: colors.blue,
    left: 0,
    top: 0,
    bottom: 0,
  },
  progressDone: {
    width: '100%',
    backgroundColor: colors.green,
  },
  errorText: {
    color: colors.red,
  },
});
