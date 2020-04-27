import React, { useEffect, useContext } from 'react';
import RNFS from 'react-native-fs';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { UploadContext } from 'pages/upload/upload.screen';
import { FilesScreen } from './files';
const Tab = createBottomTabNavigator();

const FILE_NAME = /\.(fb2|epub|fb2\.zip|zip)$/;

function useImportedFiles() {
  const uploader = useContext(UploadContext);

  useEffect(() => {
    RNFS.readDir(RNFS.DocumentDirectoryPath).then(result => {
      const books = result.filter(f => f.name.match(FILE_NAME));

      if (books.length) {
        uploader.upload(books);
      }
    });

    RNFS.readDir(RNFS.TemporaryDirectoryPath).then(result => console.log(result));
  }, []);
}

export function HomeScreen() {
  useImportedFiles();

  return (
    <Tab.Navigator>
      <Tab.Screen name='new'>{() => <FilesScreen type='new' />}</Tab.Screen>
      <Tab.Screen name='read'>{() => <FilesScreen type='read' />}</Tab.Screen>
    </Tab.Navigator>
  );
}
