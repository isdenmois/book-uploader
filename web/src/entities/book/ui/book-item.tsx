import type { Component } from 'solid-js'
import type { BookItem as IBookItem } from 'shared/api'
import { FileIcon, Item } from 'shared/ui'

interface Props {
  book: IBookItem
  onDownload: () => void
}

export const BookItem: Component<Props> = props => {
  return (
    <Item
      suptitle={props.book.authors}
      title={props.book.title}
      subtitle={[props.book.size, props.book.lang, props.book.translation].filter(p => p).join(', ')}
      onClick={props.onDownload}
      icon={<FileIcon text={props.book.ext.replace('.zip', '')} />}
    />
  )
}
