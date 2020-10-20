import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import * as colors from 'theme/colors';
import { useRecoilValueLoadable } from 'recoil';
import { Header } from './header';
import { BookList } from './book-list';
import { booksParams, booksSelector, queryState, typeState } from './search.state';
import { useSnapshotCallback } from 'utils/recoil';

type Props = {
  route: any;
};

export function SearchScreen({ route }: Props) {
  const initQuery = route.params?.initQuery;
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

const s = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: colors.Background,
  } as ViewStyle,
});
