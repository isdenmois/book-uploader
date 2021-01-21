import React, { useEffect } from 'react';
import RNFS from 'react-native-fs';
import { Linking } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { TabBar } from 'components/tab-bar';
import { SearchScreen } from './search/search.screen';
import { UploadScreen } from './upload/upload.screen';
import { ProfileScreen } from './profile/profile.screen';

const Tab = createBottomTabNavigator();

export function MainScreen() {
  useInitialScreen();

  return (
    <Tab.Navigator tabBar={TabBar}>
      <Tab.Screen name='search' component={SearchScreen} />
      <Tab.Screen name='upload' component={UploadScreen} />
      <Tab.Screen name='profile' component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const FILE_NAME = /\.(fb2|epub|fb2\.zip|zip)$/;

export function useInitialScreen() {
  const navigation = useNavigation();

  useEffect(() => {
    Promise.all([RNFS.readDir(RNFS.DocumentDirectoryPath), Linking.getInitialURL()]).then(([books, initialUrl]) => {
      books = books.filter(f => f.name.match(FILE_NAME));

      if (books.length && !initialUrl) {
        navigation.navigate('upload');
      }
    });
  }, []);
}
