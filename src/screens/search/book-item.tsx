import React, { useState } from 'react';
import { slugify } from 'transliteration';
import { Text, View, TouchableOpacity, ToastAndroid, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import * as colors from 'theme/colors';
import * as api from 'services/api/book-download';
import { FileIcon } from 'components/icons';
import { useConfirm } from 'utils/confirm';
import { ProgressBar } from 'components/progress-bar';
import { BookItem as IBookItem } from 'services/api/types';

type Props = {
  item: IBookItem;
};

export function BookItem({ item }: Props) {
  const [progress, onPress] = useDownload(item);
  const other = [item.size, item.lang, item.translation].filter(p => p).join(', ');

  return (
    <TouchableOpacity style={s.container} onPress={onPress} testID='book-item'>
      <View style={s.row}>
        <FileIcon size={35} color={colors.SearchSelected} text={item.ext.replace('.zip', '')} />

        <View style={s.common}>
          <Text style={s.secondary}>{item.authors}</Text>
          <Text style={s.title}>{item.title}</Text>
          {!!other && <Text style={s.secondary}>{other}</Text>}
        </View>
      </View>

      <ProgressBar progress={progress} color={colors.SearchSelected} />
    </TouchableOpacity>
  );
}

export function useDownload(file: IBookItem) {
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
    overflow: 'hidden',
  } as ViewStyle,
  row: {
    flexDirection: 'row',
  } as ViewStyle,
  common: {
    marginLeft: 15,
    flex: 1,
  } as ViewStyle,
  title: {
    fontSize: 16,
    color: colors.SearchText,
  } as TextStyle,
  secondary: {
    fontSize: 12,
    color: colors.Secondary,
  } as TextStyle,
});
