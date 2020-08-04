import React, { createContext, useState, useCallback, memo, useContext, useEffect, useRef } from 'react';
import { Alert, Text, View, StyleSheet, Button, ActivityIndicator } from 'react-native';
import RNFS, { ReadDirItem } from 'react-native-fs';
import { createBook } from 'services/book';
import { parseBook } from 'utils/book-parser';
import { ParseIcon, RemoveIcon, QrIcon } from 'components/icons';
import { AddressContext } from 'utils/address';
import { TouchableOpacity } from 'react-native-gesture-handler';
import * as colors from 'theme/colors';
import { useFocusEffect } from '@react-navigation/native';

export const UploadContext = createContext(null);

const IDLE = -2;
const PARSE = -1;
const DONE = 101;

const titles = {
  UPLOAD: 'Загрузка',
  HAS_ERRORS: 'Загружено с ошибками',
  FINISH: 'Загружено',
  WAITS: 'Ожидает',
  PARSE: 'Парсинг',
};

function confirm({ title, message }, onSuccess) {
  Alert.alert(title, message, [
    {
      text: 'Cancel',
      style: 'cancel',
    },
    { text: 'OK', onPress: onSuccess, style: 'destructive' },
  ]);
}

const FILE_NAME = /\.(fb2|epub|fb2\.zip|zip)$/;

function useUploader(navigation) {
  const filesRef = useRef<any>(null);
  const [files, setFiles] = useState<FileData[]>([]);
  const [state, setState] = useState('PRE-UPLOAD');

  useEffect(() => {
    const update = () => setFiles([...filesRef.current.files]);
    const remove = id => {
      filesRef.current.files = filesRef.current.files.filter(f => f.id !== id);
      update();
    };
    filesRef.current = { files, update, remove };
  }, []);

  const startUpload = useCallback(async () => {
    setState('UPLOAD');

    for (let i = 0; i < files.length; i++) {
      await files[i].upload();
    }

    const type = files.some(f => f.error) ? 'HAS_ERRORS' : 'FINISH';

    setState(type);
  }, [files]);
  const reset = useCallback(() => {
    setState('PRE-UPLOAD');
    setFiles([]);
    navigation.goBack();
  }, []);

  useFocusEffect(
    useCallback(() => {
      setState('SCAN');

      RNFS.readDir(RNFS.DocumentDirectoryPath).then(result => {
        const books = result.filter(f => f.name.match(FILE_NAME));
        filesRef.current.files = books.map(f => FileData.create(f, filesRef));

        setFiles(filesRef.current.files);
        setState('PRE-UPLOAD');
      });
    }, []),
  );

  return { files, state, startUpload, reset };
}

function useAddress() {
  return useContext(AddressContext).address;
}

function useTitle(state, address) {
  return state === 'PRE-UPLOAD' ? address : titles[state];
}

class FileData {
  id: string;
  title: string;
  progress: number = IDLE;
  error: string;

  parsed: any;
  remove: () => void;

  private update: () => void;
  private path: string;

  static create(data: ReadDirItem, fileRef) {
    return new FileData(
      data,
      () => fileRef.current.update(),
      () => fileRef.current.remove(data.name),
    );
  }

  constructor(data: ReadDirItem, update: () => void, removeFromList) {
    this.id = data.name;
    this.title = data.name;
    this.path = data.path;
    this.update = update;
    this.remove = () =>
      confirm({ title: 'Удалить файл?', message: this.title }, () => {
        removeFromList();
        this.destroy();
      });
  }

  async upload() {
    try {
      await this.parse();

      const { title, author, file, cover } = this.parsed;

      await createBook({ file, author, title, cover }, ev =>
        this.setProgress((ev.totalBytesSent / ev.totalBytesExpectedToSend) * 100),
      );

      await this.parsed.destroy();

      this.setProgress(DONE);
    } catch (e) {
      this.set('error', e?.responseText || e?.toString());
      console.error(e);
    }
  }

  parse = async () => {
    if (this.parsed) return;
    this.setProgress(PARSE);

    const data = await parseBook(this.path, this.title);
    this.parsed = data;

    this.set('title', data.title);
    this.setProgress(IDLE);
  };

  private set<T extends 'title' | 'error' | 'progress'>(key: T, value: this[T]) {
    if (this[key] !== value) {
      this[key] = value;
      this.update();
    }
  }

  private setProgress(progress: number) {
    progress = typeof progress === 'number' ? Math.round(progress) : progress;

    this.set('progress', progress);
  }

  private destroy() {
    if (this.parsed) {
      this.parsed.destroy();
    } else {
      RNFS.unlink(this.path);
    }
  }
}

export function UploadScreen({ navigation }) {
  const { files, state, startUpload, reset } = useUploader(navigation);
  const address = useAddress();
  const title = useTitle(state, address);
  const openQrScanner = useCallback(() => navigation.push('scan', { scan: true }), []);

  const isContinueButtonVisible = state !== 'UPLOAD' && files?.length > 0;

  return (
    <View style={s.visible}>
      <View style={{ flexDirection: 'row', marginTop: 20 }}>
        <Text style={s.title}>{title}</Text>

        {state === 'PRE-UPLOAD' && <QrIcon style={{ paddingHorizontal: 10 }} size={25} onPress={openQrScanner} />}
      </View>

      {state === 'SCAN' && <ActivityIndicator style={{ marginTop: 10 }} size='large' color='red' />}

      <View style={s.files}>
        {files.map(f => (
          <FileLine
            key={f.id}
            state={state}
            file={f}
            title={f.title}
            progress={f.progress}
            error={f.error}
            isParsed={Boolean(f.parsed)}
          />
        ))}
      </View>

      {isContinueButtonVisible && (
        <TouchableOpacity style={s.button} onPress={state === 'PRE-UPLOAD' ? startUpload : reset}>
          <Text style={s.buttonText}>Продолжить</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const FileLine = memo(({ state, file, title, progress, error, isParsed }) => {
  return (
    <View style={{ marginBottom: 20, flexDirection: 'row' }}>
      <View style={{ flex: 1 }}>
        <Text>{title}</Text>

        {!error && progress > 0 && (
          <View style={s.progress}>
            <View
              style={progress > 100 ? [s.progressLine, s.progressDone] : [s.progressLine, { width: `${progress}%` }]}
            />
          </View>
        )}

        {!error && progress === PARSE && <Text>Парсинг</Text>}

        {Boolean(error) && <Text style={s.errorText}>{error}</Text>}
      </View>

      {state === 'PRE-UPLOAD' && (
        <>
          {!isParsed && progress !== PARSE && <ParseIcon style={{ paddingLeft: 10 }} size={25} onPress={file.parse} />}

          {!isParsed && progress === PARSE && (
            <ActivityIndicator style={{ paddingLeft: 10 }} color={colors.green} size={25} />
          )}

          {progress !== PARSE && <RemoveIcon style={{ paddingLeft: 10 }} size={25} onPress={file.remove} />}
        </>
      )}
    </View>
  );
});

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
