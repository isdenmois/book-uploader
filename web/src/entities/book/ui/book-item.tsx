import { Component, createMemo, Show } from 'solid-js'
import type { BookItem as IBookItem } from 'shared/api'
import { FileIcon, Item } from 'shared/ui'
import { getImageUrl } from 'shared/api/book-image'

interface Props {
  book: IBookItem
  onDownload: () => void
}

export const BookItem: Component<Props> = props => {
  const imageUrl = createMemo(() => getImageUrl(props.book.type, props.book.imageUrl))
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
      icon={
        <Show when={imageUrl()} fallback={<FileIcon text={ext()} />}>
          <div class='book-image'>
            <img src={imageUrl()} />
            <div class='book-ext'>{ext()}</div>
          </div>
        </Show>
      }
    />
  )
}
