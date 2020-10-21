import React from 'react';
import { Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import RNFS from 'react-native-fs';
import { uploadFile } from 'services/api/upload';
import { EbookParser } from 'services/book-parser';
import { addressState } from 'services/address';
import { TouchableOpacity } from 'react-native-gesture-handler';
import * as colors from 'theme/colors';
import { useRecoilValue } from 'recoil';
import { fileFamily, filesState, uploadState } from './upload.state';
import { useSnapshotCallback } from 'utils/recoil';

export function UploadButton() {
  const isButtonVisible = useUploadVisible();
  const startUpload = useUpload();

  if (!isButtonVisible) return null;

  return (
    <TouchableOpacity style={s.button} onPress={startUpload}>
      <Text style={s.buttonText}>Start upload</Text>
    </TouchableOpacity>
  );
}

export function useUploadVisible() {
  const files = useRecoilValue(filesState);
  const state = useRecoilValue(uploadState);
  const address = useRecoilValue(addressState);

  return address && (state === 'IDLE' || state === 'HAS_ERRORS') && files?.length > 0;
}

export function useUpload() {
  return useSnapshotCallback(async ({ get, set, merge }) => {
    const files = get(filesState);
    const address = get(addressState);
    let hasErrors = false;

    set(uploadState, 'UPLOAD');

    for (let id of files) {
      const fileId = fileFamily(id);
      const setProgress = progress => merge(fileId, { progress });
      const file = get(fileId);

      if (file.isUploaded) continue;

      // Set initial progress
      merge(fileId, { error: null, progress: 0.01 });

      try {
        const parsed = await EbookParser.getMetadata(file.path);

        // Update book data
        merge(fileId, { title: parsed.title, author: parsed.author, isParsed: true });

        await uploadFile(address, parsed.file, setProgress);

        // Remove file
        await RNFS.unlink(parsed.file.filepath);

        // Set upload status
        merge(fileId, { progress: 100, isUploaded: true });
      } catch (e) {
        hasErrors = true;
        merge(fileId, { error: e?.responseText || e?.toString() });
        console.error(e);
      }
    }

    set(uploadState, hasErrors ? 'HAS_ERRORS' : 'FINISH');
  }, []);
}

const s = StyleSheet.create({
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: colors.UploadSelected,
    paddingVertical: 10,
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 35,
  } as ViewStyle,
  buttonText: {
    color: colors.InvertedText,
    fontSize: 16,
  } as TextStyle,
});
