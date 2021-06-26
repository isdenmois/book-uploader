import React from 'react'
import { render } from '@testing-library/react-native'
jest.mock('@react-native-community/async-storage', () => ({}))
import { addressChanged } from '../model'
import { UploadAddress } from '../ui'
import { act } from 'react-test-renderer'

it('UploadAddress', () => {
  addressChanged('192.168.1.1')

  const { getByTestId, toJSON } = render(<UploadAddress />)

  expect(getByTestId('uploadAddress').children[0]).toBe('192.168.1.1')

  act(() => {
    addressChanged('192.168.1.77')
  })

  expect(getByTestId('uploadAddress').children[0]).toBe('192.168.1.77')

  act(() => {
    addressChanged(null)
  })

  expect(toJSON()).toBeNull()
})
