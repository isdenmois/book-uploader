import React from 'react'
import { render } from '@testing-library/react-native'
import { ActivityIndicator } from '../activity-indicator'

test('ActivityIndicator', () => {
  expect(render(<ActivityIndicator color='primary' />).toJSON()).toMatchSnapshot()
})
