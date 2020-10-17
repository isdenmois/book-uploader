import React, { useEffect, useState, useCallback } from 'react';
import RNFS from 'react-native-fs';
import { ActivityIndicator, Linking } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useDeepLink } from 'utils/deep-link';
import { SearchScreen } from './search';
import { UploadScreen } from './upload/upload.screen';
import { LoginScreen } from './login';

const Tab = createBottomTabNavigator();

export function MainScreen() {
  const screen = useInitialScreen();
  const initQuery = useInitialQuery();

  if (screen === null || initQuery === null) {
    return <ActivityIndicator size='large' color='red' />;
  }

  return (
    <Tab.Navigator initialRouteName={screen}>
      <Tab.Screen name='search' component={SearchScreen} initialParams={{ initQuery }} />
      <Tab.Screen name='upload' component={UploadScreen} />
      <Tab.Screen name='profile' component={LoginScreen} />
    </Tab.Navigator>
  );
}

export function useInitialQuery(): string {
  const [initQuery, setQuery] = useState<string>(null);
  const navigation = useNavigation();
  const onLink = useCallback(link => {
    if (link) {
      link = link.replace('booksearch://', '');

      if (isTabsInitialized(navigation, 'home')) {
        navigation.navigate('search', { initQuery: link });
      }
    }

    setQuery(link || '');
  }, []);

  useDeepLink(onLink);

  return initQuery;
}

const FILE_NAME = /\.(fb2|epub|fb2\.zip|zip)$/;

export function useInitialScreen() {
  const [screen, setScreen] = useState(null);

  useEffect(() => {
    Promise.all([RNFS.readDir(RNFS.DocumentDirectoryPath), Linking.getInitialURL()]).then(([books, initialUrl]) => {
      books = books.filter(f => f.name.match(FILE_NAME));
      setScreen(books.length && !initialUrl ? 'upload' : 'search');
    });
  }, []);

  return screen;
}

function isTabsInitialized(navigation: NavigationProp<any>, screenName: string): boolean {
  const state = navigation.dangerouslyGetState();
  const screen = state?.routes?.find(s => s.name === screenName);

  return Boolean(screen && screen.state);
}
