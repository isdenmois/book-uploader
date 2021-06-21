import React from 'react'
import { FlatList, Image, View } from 'react-native'
import { BookItem } from './book-item'
import { Text, withSuspense } from 'shared/ui'
import { useRecoilValue } from 'recoil'
import { booksSelector } from './search.state'
import { StyleSheet } from 'react-native'

export const BookList = withSuspense(() => {
  const books = useRecoilValue(booksSelector)

  if (!books)
    return (
      <View style={s.empty}>
        <Image style={s.image} source={require('./img/start-search.png')} fadeDuration={0} resizeMode='contain' />
        <Text style={s.startText} color='search'>
          Start search books to see a result
        </Text>
      </View>
    )

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
          <Text style={s.emptyText} color='search'>
            Nothing has found
          </Text>
        </View>
      }
    />
  )
})

const s = StyleSheet.create({
  empty: {
    flex: 1,
    marginTop: 30,
  },
  image: {
    width: '100%',
  },
  startText: {
    fontSize: 20,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 24,
    textAlign: 'center',
    marginTop: 20,
  },
  list: {
    marginTop: 15,
  },
  listContent: {
    paddingHorizontal: 15,
  },
})
