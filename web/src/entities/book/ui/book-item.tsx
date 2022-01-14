import { Component, createMemo } from 'solid-js'
import type { BookItem as IBookItem } from 'shared/api'
import { FileIcon, Item } from 'shared/ui'

interface Props {
  book: IBookItem
  onDownload: () => void
}

export const BookItem: Component<Props> = props => {
  const ext = createMemo(() => props.book.ext.replace('.zip', ''))
  const additional = createMemo(() =>
    [props.book.size, props.book.lang, props.book.translation].filter(p => p).join(', '),
  )

  return (
    <Item
      suptitle={props.book.authors}
      title={props.book.title}
      subtitle={additional()}
      onClick={props.onDownload}
      icon={<FileIcon text={ext()} />}
    />
  )
}
