import React, { useCallback, useState } from 'react';
import { View } from 'react-native';
import { dynamicColor } from 'theme/colors';
import { useNavigation } from '@react-navigation/native';
import { useRecoilValueLoadable } from 'recoil';
import { Header } from './header';
import { BookList } from './book-list';
import { booksParams, booksSelector, extensionState, queryState, typeState } from './search.state';
import { useSnapshotCallback } from 'utils/recoil';
import { useDeepLink } from 'utils/deep-link';
import { DynamicStyleSheet, useDynamicStyleSheet } from 'react-native-dynamic';

export function SearchScreen() {
  const s = useDynamicStyleSheet(ds);
  const initQuery = useInitialQuery();
  const disabled = useRecoilValueLoadable(booksSelector).state === 'loading';
  const onSearch = useSnapshotCallback(({ get, set }) => {
    const type = get(typeState);
    const query = get(queryState);
    const extension = get(extensionState);

    set(booksParams, { type, query, extension });
  });

  return (
    <View style={s.container}>
      <Header onSearch={onSearch} initQuery={initQuery} disabled={disabled} />
      <BookList />
    </View>
  );
}

function useInitialQuery(): string {
  const [initQuery, setQuery] = useState<string>(null);
  const navigation = useNavigation();
  const onLink = useCallback(link => {
    if (link) {
      link = link.replace('booksearch://', '');
    }

    setQuery(link || '');
    navigation.navigate('search');
  }, []);

  useDeepLink(onLink);

  return initQuery;
}

const ds = new DynamicStyleSheet({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: dynamicColor.background,
  },
});
