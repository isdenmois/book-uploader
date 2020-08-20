import React, { useEffect, useState } from 'react';
import RNFS from 'react-native-fs';
import { ActivityIndicator, Linking } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SearchScreen } from './search';
import { UploadScreen } from './upload/upload.screen';

const Tab = createBottomTabNavigator();

const FILE_NAME = /\.(fb2|epub|fb2\.zip|zip)$/;

export function HomeScreen({ navigation }) {
  const screen = useInitialScreen();
  const initQuery = useDeepLinkQuery(navigation);

  if (screen === null) {
    return <ActivityIndicator size='large' color='red' />;
  }

  return (
    <Tab.Navigator initialRouteName={screen}>
      <Tab.Screen name='search' component={SearchScreen} options={{ params: { initQuery } }} />
      <Tab.Screen name='upload' component={UploadScreen} options={{ header: () => null }} />
    </Tab.Navigator>
  );
}

function useDeepLinkQuery(navigation) {
  const [query, setQuery] = useState(null);

  useEffect(() => {
    Linking.getInitialURL().then(setURL);
    Linking.addEventListener('url', setURL);

    return () => Linking.removeEventListener('url', setURL);
  }, []);

  return query;

  function setURL(link) {
    if (link?.url) {
      link = link.url.replace('booksearch://', '');
      navigation.navigate('search', { initQuery: link });
    }

    setQuery(link);
  }
}

function useInitialScreen() {
  const [screen, setScreen] = useState(null);

  useEffect(() => {
    Promise.all([
      RNFS.readDir(RNFS.DocumentDirectoryPath).then(result => result.filter(f => f.name.match(FILE_NAME))),
      Linking.getInitialURL(),
    ]).then(([books, initialUrl]) => {
      setScreen(books.length && !initialUrl ? 'upload' : 'search');
    });
  }, []);

  return screen;
}
