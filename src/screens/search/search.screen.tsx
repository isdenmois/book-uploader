import React, { useCallback, useState } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import * as colors from 'theme/colors';
import { useNavigation } from '@react-navigation/native';
import { useRecoilValueLoadable } from 'recoil';
import { Header } from './header';
import { BookList } from './book-list';
import { booksParams, booksSelector, queryState, typeState } from './search.state';
import { useSnapshotCallback } from 'utils/recoil';
import { useDeepLink } from 'utils/deep-link';

export function SearchScreen() {
  const initQuery = useInitialQuery();
  const disabled = useRecoilValueLoadable(booksSelector).state === 'loading';
  const onSearch = useSnapshotCallback(({ get, set }) => {
    const type = get(typeState);
    const query = get(queryState);

    set(booksParams, { type, query });
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

const s = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: colors.Background,
  } as ViewStyle,
});
