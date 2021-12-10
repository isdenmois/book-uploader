import React, { FC, memo } from 'react'
import { StyleSheet } from 'react-native'
import FastImage from 'react-native-fast-image'

import { BookItem as IBookItem } from 'shared/api'
import { getImageUrl } from 'shared/api/book-image'
import { Box, FileIcon, Item, Text } from 'shared/ui'

interface Props {
  item: IBookItem
  onPress: (item: IBookItem) => void
}

export const BookItem: FC<Props> = memo<Props>(
  ({ item, onPress }) => {
    const other = [item.size, item.lang, item.translation].filter(p => p).join(', ')
    const ext = item.ext.replace('.zip', '')
    const imageUrl = getImageUrl(item.type, item.imageUrl)

    return (
      <Item mb={3} onPress={() => onPress(item)} testID='book-item'>
        {!!imageUrl && (
          <Box borderRadius={4} width={40} height={50} overflow='hidden' backgroundColor='searchSelected'>
            <FastImage style={s.image} source={{ uri: imageUrl }} resizeMode='cover' />

            <Text fontSize={12} fontWeight='bold' textAlign='center' color='white' style={s.text}>
              {ext}
            </Text>
          </Box>
        )}
        {!imageUrl && <FileIcon color='searchSelected' text={ext} />}

        <Item.Text suptitle={item.authors} title={item.title} subtitle={other} />
      </Item>
    )
  },
  (prev, next) => prev.item === next.item,
)

const s = StyleSheet.create({
  image: {
    width: 40,
    height: 50,
  },
  text: {
    backgroundColor: '#0005',
    bottom: 0,
    left: 0,
    right: 0,
    position: 'absolute',
  },
})
