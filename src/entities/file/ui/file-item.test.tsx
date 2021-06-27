import React from 'react'
import { act, fireEvent, render, RenderAPI } from '@testing-library/react-native'
import { Alert } from 'react-native'
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper')
import { mock } from 'shared/utils/test-utils/async'
import { ThemeProvider } from 'shared/ui'
import { FileData } from '../model'
import { FileItem } from './file-item'

describe('FileItem', () => {
  const file: FileData = { id: '123', title: 'Hello', author: 'Somebody', ext: 'epub', path: '/tmp/smbdy-hello.epub' }
  const alert = mock(Alert, 'alert')
  const onRemove = jest.fn()
  const onParse = jest.fn()
  const onShare = jest.fn()

  let r: RenderAPI

  beforeEach(() => {
    r = render(<FileItem file={file} onRemove={onRemove} onParse={onParse} onShare={onShare} />, {
      wrapper: ThemeProvider,
    })
  })

  afterEach(() =>
    act(async () => {
      r.unmount()
    }),
  )

  it('should render', () => {
    expect(r.toJSON()).toMatchSnapshot()
  })

  it('should be able to remove file', () => {
    fireEvent.press(r.getByTestId('removeFile'))

    expect(onRemove).not.toHaveBeenCalled()
    expect(alert).toHaveBeenCalled()

    alert.mock.calls[0][2][1].onPress()

    expect(onRemove).toHaveBeenCalledWith(file)
  })

  it('should call onShare on tap', () => {
    fireEvent.press(r.getByTestId('file-item-123'))

    expect(onShare).toHaveBeenCalledWith(file)
  })

  it('should call onParse on long tap', () => {
    fireEvent(r.getByTestId('file-item-123'), 'longPress')

    expect(onParse).toHaveBeenCalledWith(file)
  })

  it('should show an error', () => {
    r.rerender(
      <FileItem
        file={{ ...file, error: 'Something went wrong' }}
        onRemove={onRemove}
        onParse={onParse}
        onShare={onShare}
      />,
    )
    expect(r.toJSON()).toMatchSnapshot()
  })
})
