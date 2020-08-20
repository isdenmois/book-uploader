import React, { useEffect, useState } from 'react';
import RNFS from 'react-native-fs';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SearchScreen } from './search';
import { UploadScreen } from './upload/upload.screen';
import { ActivityIndicator } from 'react-native';

const Tab = createBottomTabNavigator();

const FILE_NAME = /\.(fb2|epub|fb2\.zip|zip)$/;

function useInitialScreen() {
  const [screen, setScreen] = useState(null);

  useEffect(() => {
    RNFS.readDir(RNFS.DocumentDirectoryPath).then(result => {
      const books = result.filter(f => f.name.match(FILE_NAME));

      setScreen(books.length ? 'upload' : 'search');
    });

    RNFS.readDir(RNFS.TemporaryDirectoryPath).then(result => console.log(result));
  }, []);

  return screen;
}

export function HomeScreen() {
  const screen = useInitialScreen();

  if (screen === null) {
    return <ActivityIndicator size='large' color='red' />;
  }

  return (
    <Tab.Navigator initialRouteName={screen}>
      <Tab.Screen name='search' component={SearchScreen} />
      <Tab.Screen name='upload' component={UploadScreen} options={{ header: () => null }} />
    </Tab.Navigator>
  );
}
