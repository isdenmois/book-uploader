import React, { useState } from 'react';
import { slugify } from 'transliteration';
import RNFS from 'react-native-fs';
import { Alert, Text, View, ActivityIndicator, FlatList, ToastAndroid } from 'react-native';
import { searchHandler } from 'api';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { fileUrl } from 'api';

export function SearchScreen() {
  const [type, setType] = useState('zlib');
  const [files, setFiles] = useState(null);
  const [l, setL] = useState(false);
  const toSearch = async query => {
    setL(true);
    try {
      const { data } = await searchHandler(type, query);

      setFiles(data);
    } catch (e) {
      console.error(e?.message || e);
    }

    setL(false);
  };
  const toggleType = () => {
    setType(type === 'zlib' ? 'flibusta' : 'zlib');
    setFiles(null);
  };
  const toggler = (
    <View style={{ position: 'absolute', bottom: 10, alignItems: 'center', left: 0, right: 0, zIndex: 2 }}>
      <TouchableOpacity
        style={{
          elevation: 2,
          backgroundColor: 'white',
          borderRadius: 20,
          paddingHorizontal: 20,
          paddingVertical: 10,
        }}
        onPress={!l && toggleType}
      >
        <Text style={{ flex: 1, fontSize: 16 }}>{type === 'zlib' ? 'Z-Library' : 'Flibusta'}</Text>
      </TouchableOpacity>
    </View>
  );

  if (l) {
    return (
      <View style={{ flex: 1 }}>
        {toggler}
        <Header search={toSearch} disabled />

        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size='large' color='red' />
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, position: 'relative' }}>
      {toggler}

      <Header search={toSearch} />

      {!files && <Text>Начните поиск</Text>}
      {!!files && !files.length && <Text>Ничего не найдено</Text>}
      <FlatList
        data={files}
        keyExtractor={item => item.link}
        renderItem={({ item }) => <BookItem item={item} type={type} />}
        contentContainerStyle={{ paddingHorizontal: 10, paddingBottom: 60 }}
      />
    </View>
  );
}

function Header({ search, disabled }) {
  const [query, setQuery] = useState('');
  const toSearch = () => search(query);

  return (
    <View style={{ flexDirection: 'row', borderBottomColor: '#000', borderBottomWidth: 1 }}>
      <TextInput
        style={{ flex: 1, fontSize: 14, color: '#000' }}
        editable={!disabled}
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={toSearch}
        returnKeyType='search'
        placeholder='Search books'
        autoFocus
      />
    </View>
  );
}

function BookItem({ item, type }) {
  const [progress, setProgress] = useState(0);

  const onPress = async () => {
    const URL = await fileUrl(type, item.link);
    const title = slugify(item.title).slice(0, 100);
    const fileName = `${title}.${item.ext}`;

    confirm(fileName, 'Скачать файл?', async () => {
      ToastAndroid.show('Загружаю', ToastAndroid.SHORT);
      console.warn(URL);

      try {
        setProgress(0.01);
        await RNFS.downloadFile({
          fromUrl: URL,
          toFile: `${RNFS.DocumentDirectoryPath}/${fileName}`,
          headers: {
            'user-agent':
              'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.89 Safari/537.36',
          },
          progress: ({ contentLength, bytesWritten }) => setProgress(Math.round((bytesWritten / contentLength) * 100)),
        }).promise;

        setProgress(0);
        ToastAndroid.show('Файл загружен!', ToastAndroid.SHORT);
      } catch (e) {
        console.error(e?.message || e);
        ToastAndroid.show('Не удалось загрузить файл', ToastAndroid.SHORT);
      }
    });
  };

  return (
    <TouchableOpacity style={{ marginBottom: 10 }} onPress={onPress}>
      <Text>{item.title}</Text>
      <Text>{item.authors}</Text>
      {!!item.lang && <Text>Lang: {item.lang}</Text>}
      {!!item.translation && <Text>Translator: {item.translation}</Text>}
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

function confirm(title, message, onSuccess) {
  Alert.alert(title, message, [
    {
      text: 'Cancel',
      style: 'cancel',
    },
    { text: 'OK', onPress: onSuccess, style: 'destructive' },
  ]);
}
