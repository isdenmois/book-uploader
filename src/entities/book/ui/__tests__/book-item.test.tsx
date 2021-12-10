import React from 'react'
import { act, fireEvent, render } from '@testing-library/react-native'

import { BookItem as IBookItem } from 'shared/api'
import { ThemeProvider } from 'shared/ui'

import { BookItem } from '../book-item'

test('BookItem', async () => {
  const item: IBookItem = { ext: 'epub', type: 'ZLIB', title: 'Test result', link: 'http://example.com' }
  const onPress = jest.fn()

  const { toJSON, getByTestId, unmount } = render(<BookItem item={item} onPress={onPress} />, {
    wrapper: ThemeProvider,
  })

  expect(toJSON()).toMatchSnapshot()

  fireEvent.press(getByTestId('book-item'))

  expect(onPress).toHaveBeenCalledWith(item)

  await act(async () => {
    unmount()
  })
})
