import React, { useState } from 'react';
import { slugify } from 'transliteration';
import { Text, View, TouchableOpacity, ToastAndroid } from 'react-native';
import { dynamicColor, useSColor } from 'theme/colors';
import * as api from 'services/api/book-download';
import { FileIcon } from 'components/icons';
import { useConfirm } from 'utils/confirm';
import { ProgressBar } from 'components/progress-bar';
import { BookItem as IBookItem } from 'services/api/types';
import { DynamicStyleSheet } from 'react-native-dynamic';

type Props = {
  item: IBookItem;
};

export function BookItem({ item }: Props) {
  const [progress, onPress] = useDownload(item);
  const { s, color } = useSColor(ds);
  const other = [item.size, item.lang, item.translation].filter(p => p).join(', ');

  return (
    <TouchableOpacity style={s.container} onPress={onPress} testID='book-item'>
      <View style={s.row}>
        <FileIcon size={40} color={color.searchSelected} text={item.ext.replace('.zip', '')} />

        <View style={s.common}>
          <Text style={s.secondary}>{item.authors}</Text>
          <Text style={s.title}>{item.title}</Text>
          {!!other && <Text style={s.secondary}>{other}</Text>}
        </View>
      </View>

      <ProgressBar progress={progress} color={color.searchSelected} />
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

const ds = new DynamicStyleSheet({
  container: {
    marginBottom: 20,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
  },
  common: {
    marginLeft: 10,
    flex: 1,
  },
  title: {
    fontSize: 16,
    color: dynamicColor.searchText,
  },
  secondary: {
    fontSize: 12,
    color: dynamicColor.secondary,
  },
});
