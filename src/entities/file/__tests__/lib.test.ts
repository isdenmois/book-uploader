jest.mock('react-native-fs', () => ({}))
jest.mock('react-native-file-opener', () => ({}))
jest.mock('shared/libs', () => ({ EbookParser: {} }))

import RNFS from 'react-native-fs'
import FileOpener from 'react-native-file-opener'
import { EbookParser } from 'shared/libs'
import { mock } from 'shared/utils/test-utils/async'
import { parseFile, removeFile, shareFile } from '../lib'
import { FileData } from '../model'

describe('file/lib', () => {
  const file: FileData = { id: '1', ext: 'epub', title: 'Hello', path: '/tmp/hello.epub' }

  it('parseFile', () => {
    const getMetadata = mock(EbookParser, 'getMetadata')

    parseFile(file)

    expect(getMetadata).toHaveBeenCalledWith(file.path)
  })

  it('removeFile', () => {
    const unlink = mock(RNFS, 'unlink')

    removeFile(file)

    expect(unlink).toHaveBeenCalledWith(file.path)
  })

  it('shareFile', () => {
    const open = mock(FileOpener, 'open')

    shareFile(file)
    expect(open).toHaveBeenCalledWith(file.path, 'application/epub')

    shareFile({ ...file, ext: 'fb2', path: '/tmp/test.fb2' })
    expect(open).toHaveBeenCalledWith('/tmp/test.fb2', 'application/fb2')
  })
})
