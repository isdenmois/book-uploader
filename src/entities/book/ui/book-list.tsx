import React, { FC } from 'react'
import { FlatList, Image, StyleSheet, View } from 'react-native'

import { BookItem as IBookItem } from 'shared/api'
import { ActivityIndicator, Box, Text } from 'shared/ui'
import { Images } from 'shared/assets'

import { BookItem } from './book-item'

type Props = {
  books: IBookItem[]
  isLoading: boolean
  onDownload: (item: IBookItem) => void
}

export const BookList: FC<Props> = ({ onDownload, books, isLoading }) => {
  if (isLoading) {
    return (
      <Box flex={1} justifyContent='center'>
        <ActivityIndicator color='searchSelected' size='large' />
      </Box>
    )
  }

  if (!books)
    return (
      <View style={s.empty}>
        <Image style={s.image} source={Images.startSearch} fadeDuration={0} resizeMode='contain' />
        <Text style={s.startText} color='search'>
          Start search books to see a result
        </Text>
      </View>
    )

  return (
    <FlatList
      data={books}
      keyExtractor={item => item.link}
      renderItem={({ item }) => <BookItem item={item} onPress={onDownload} />}
      style={s.list}
      contentContainerStyle={s.listContent}
      ListEmptyComponent={
        <View style={s.empty}>
          <Image style={s.image} source={Images.noResult} fadeDuration={0} resizeMode='contain' />
          <Text style={s.emptyText} color='search'>
            Nothing has found
          </Text>
        </View>
      }
    />
  )
}

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
