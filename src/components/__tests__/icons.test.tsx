import React from 'react';
import { render } from '@testing-library/react-native';
jest.mock('react-native-svg');

import { ShareIcon, RemoveIcon, QrIcon, ParseIcon } from '../icons';

test('icons', () => {
  expect(render(<ShareIcon size={10} />).toJSON()).toBeTruthy();
  expect(render(<RemoveIcon size={10} />).toJSON()).toBeTruthy();
  expect(render(<QrIcon size={10} />).toJSON()).toBeTruthy();
  expect(render(<ParseIcon size={10} />).toJSON()).toBeTruthy();
});
