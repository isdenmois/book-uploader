import React from 'react'
import { render } from '@testing-library/react-native'

import {
  AccountIcon,
  ClearIcon,
  DownloadIcon,
  EmailIcon,
  FileIcon,
  KeyIcon,
  QrIcon,
  SearchIcon,
  SuccessIcon,
  TimesIcon,
  UploadIcon,
} from '../icons'

test('icons', () => {
  expect(render(<AccountIcon size={10} color='primary' />).toJSON()).toBeTruthy()
  expect(render(<ClearIcon />).toJSON()).toBeTruthy()
  expect(render(<DownloadIcon />).toJSON()).toBeTruthy()
  expect(render(<EmailIcon />).toJSON()).toBeTruthy()
  expect(render(<FileIcon size={10} color='primary' text='fb2' />).toJSON()).toBeTruthy()
  expect(render(<KeyIcon />).toJSON()).toBeTruthy()
  expect(render(<QrIcon size={10} color='primary' />).toJSON()).toBeTruthy()
  expect(render(<SearchIcon size={10} color='primary' />).toJSON()).toBeTruthy()
  expect(render(<SuccessIcon size={10} color='primary' />).toJSON()).toBeTruthy()
  expect(render(<TimesIcon />).toJSON()).toBeTruthy()
  expect(render(<UploadIcon size={10} color='primary' />).toJSON()).toBeTruthy()
})
