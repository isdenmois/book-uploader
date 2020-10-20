import React from 'react';
import { Text, FlatList, StyleSheet, ViewStyle, TextStyle, Image, View } from 'react-native';
import * as colors from 'theme/colors';
import { BookItem } from './book-item';
import { withSuspense } from 'utils/withSuspense';
import { useRecoilValue } from 'recoil';
import { booksSelector } from './search.state';

export const BookList = withSuspense(() => {
  const books = useRecoilValue(booksSelector);

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

const s = StyleSheet.create({
  empty: {
    flex: 1,
    marginTop: 50,
  } as ViewStyle,
  image: {
    width: '100%',
  },
  startText: {
    fontSize: 20,
    color: colors.Search,
    textAlign: 'center',
  } as TextStyle,
  emptyText: {
    fontSize: 24,
    color: colors.Search,
    textAlign: 'center',
    marginTop: 20,
  } as TextStyle,
  list: {
    marginTop: 15,
  },
  listContent: {
    paddingHorizontal: 15,
  } as ViewStyle,
});
