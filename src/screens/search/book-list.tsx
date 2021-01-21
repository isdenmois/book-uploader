import React from 'react';
import { Text, FlatList, Image, View } from 'react-native';
import { dynamicColor } from 'theme/colors';
import { BookItem } from './book-item';
import { withSuspense } from 'utils/withSuspense';
import { useRecoilValue } from 'recoil';
import { booksSelector } from './search.state';
import { DynamicStyleSheet, useDynamicStyleSheet } from 'react-native-dynamic';

export const BookList = withSuspense(() => {
  const books = useRecoilValue(booksSelector);
  const s = useDynamicStyleSheet(ds);

  if (!books)
    return (
      <View style={s.empty}>
        <Image style={s.image} source={require('./img/start-search.png')} fadeDuration={0} resizeMode='contain' />
        <Text style={s.startText}>Start search books to see a result</Text>
      </View>
    );

  return (
    <FlatList
      data={books}
      keyExtractor={item => item.link}
      renderItem={({ item }) => <BookItem item={item} />}
      style={s.list}
      contentContainerStyle={s.listContent}
      ListEmptyComponent={
        <View style={s.empty}>
          <Image style={s.image} source={require('./img/no-result.png')} fadeDuration={0} resizeMode='contain' />
          <Text style={s.emptyText}>Nothing has found</Text>
        </View>
      }
    />
  );
});

const ds = new DynamicStyleSheet({
  empty: {
    flex: 1,
    marginTop: 30,
  },
  image: {
    width: '100%',
  },
  startText: {
    fontSize: 20,
    color: dynamicColor.search,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 24,
    color: dynamicColor.search,
    textAlign: 'center',
    marginTop: 20,
  },
  list: {
    marginTop: 15,
  },
  listContent: {
    paddingHorizontal: 15,
  },
});
