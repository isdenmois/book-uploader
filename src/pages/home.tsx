import React, { useEffect } from 'react';
import RNFS from 'react-native-fs';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FilesScreen } from './files';
const Tab = createBottomTabNavigator();

const FILE_NAME = /\.(fb2|epub|fb2\.zip|zip)$/;

function useImportedFiles(navigation) {
  useEffect(() => {
    RNFS.readDir(RNFS.DocumentDirectoryPath).then(result => {
      const books = result.filter(f => f.name.match(FILE_NAME));

      if (books.length) {
        navigation.push('upload', { books });
      }
    });

    RNFS.readDir(RNFS.TemporaryDirectoryPath).then(result => console.log(result));
  }, []);
}

export function HomeScreen({ navigation }) {
  useImportedFiles(navigation);

  return (
    <Tab.Navigator>
      <Tab.Screen name='new'>{() => <FilesScreen type='new' />}</Tab.Screen>
      <Tab.Screen name='read'>{() => <FilesScreen type='read' />}</Tab.Screen>
    </Tab.Navigator>
  );
}
