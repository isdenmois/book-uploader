import React, { useState } from 'react';
import { slugify } from 'transliteration';
import { Text, View, TouchableOpacity, ToastAndroid, StyleSheet, ViewStyle } from 'react-native';
import * as colors from 'theme/colors';
import * as api from 'services/api/book-download';
import { FileIcon } from 'components/icons';
import { useConfirm } from 'utils/confirm';
import { ProgressBar } from 'components/progress-bar';

export function BookItem({ item }) {
  const [progress, onPress] = useDownload(item);
  const other = [item.size, item.lang, item.translation].filter(p => p).join(', ');

  return (
    <TouchableOpacity style={s.container} onPress={onPress} testID='book-item'>
      <View style={{ flexDirection: 'row' }}>
        <FileIcon size={35} color={colors.SearchSelected} text={item.ext} />

        <View style={{ marginLeft: 15 }}>
          <Text style={{ fontSize: 12, color: colors.Secondary }}>{item.authors}</Text>
          <Text style={{ fontSize: 16, color: colors.SearchText }}>{item.title}</Text>
          {!!other && <Text style={{ fontSize: 12, color: colors.Secondary }}>{other}</Text>}
        </View>
      </View>

      <ProgressBar progress={progress} color={colors.SearchSelected} />
    </TouchableOpacity>
  );
}

export function useDownload(file) {
  const [progress, setProgress] = useState(0);
  const title = slugify(file.title).slice(0, 100);
  const fileName = `${title}.${file.ext}`;

  const onPress = useConfirm(fileName, 'Start download?', async () => {
    ToastAndroid.show('Start downloading', ToastAndroid.SHORT);

    try {
      await api.downloadFile(file, fileName, setProgress);

      ToastAndroid.show(`File ${fileName} has downloaded!`, ToastAndroid.SHORT);
    } catch (e) {
      console.error(e?.message || e);
      ToastAndroid.show(`Error: ${e?.message || e}`, ToastAndroid.SHORT);
    }

    setProgress(0);
  });

  return [progress, onPress] as const;
}

const s = StyleSheet.create({
  container: {
    marginBottom: 20,
  } as ViewStyle,
});
