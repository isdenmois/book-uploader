import React, { useState } from 'react';
import { slugify } from 'transliteration';
import { Alert, Text, View, TouchableOpacity, ToastAndroid, StyleSheet, ViewStyle } from 'react-native';
import * as api from 'services/api/book-download';

export function BookItem({ item }) {
  const [progress, onPress] = useDownload(item);

  return (
    <TouchableOpacity style={s.container} onPress={onPress} testID='book-item'>
      <Text>{item.title}</Text>
      <Text>{item.authors}</Text>
      {!!item.lang && <Text>Lang: {item.lang}</Text>}
      {!!item.translation && <Text>Translator: {item.translation}</Text>}
      {!!item.size && <Text>Size: {item.size}</Text>}
      {progress > 0 && (
        <View
          style={{
            height: 5,
            position: 'relative',
            backgroundColor: '#ddd',
            borderRadius: 2,
            marginTop: 4,
            overflow: 'hidden',
          }}
        >
          <View
            style={{ width: `${progress}%`, backgroundColor: '#f00', position: 'absolute', left: 0, top: 0, bottom: 0 }}
          />
        </View>
      )}
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

export function useConfirm(title, message, onSuccess) {
  return () => {
    confirm(title, message, onSuccess);
  };
}

function confirm(title: string, message: string, onSuccess) {
  Alert.alert(title, message, [
    {
      text: 'Cancel',
      style: 'cancel',
    },
    { text: 'OK', onPress: onSuccess, style: 'destructive' },
  ]);
}

const s = StyleSheet.create({
  container: {
    marginBottom: 10,
  } as ViewStyle,
});
