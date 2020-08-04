import React, { useEffect, useState } from 'react';
import RNFS from 'react-native-fs';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FilesScreen } from './files';
import { Text, View, Button, ActivityIndicator, FlatList, CheckBox, Switch } from 'react-native';
import { searchHandler } from 'api';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { SearchScreen } from './search';
import { UploadScreen } from './upload/upload.screen';
// import {} from './upload';

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
  // useImportedFiles(navigation);

  return (
    <Tab.Navigator>
      <Tab.Screen name='Search' component={SearchScreen} />
      <Tab.Screen name='Upload' component={UploadScreen} options={{ header: () => null }} />
    </Tab.Navigator>
  );
}
