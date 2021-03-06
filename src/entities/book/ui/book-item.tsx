import React, { FC } from 'react'

import { BookItem as IBookItem } from 'shared/api'
import { FileIcon, Item } from 'shared/ui'

interface Props {
  item: IBookItem
  onPress: (item: IBookItem) => void
}

export const BookItem: FC<Props> = ({ item, onPress }) => {
  const other = [item.size, item.lang, item.translation].filter(p => p).join(', ')
  const ext = item.ext.replace('.zip', '')

  return (
    <Item mb={3} onPress={() => onPress(item)} testID='book-item'>
      <FileIcon size={40} color='searchSelected' text={ext} />

      <Item.Text suptitle={item.authors} title={item.title} subtitle={other} />
    </Item>
  )
}
