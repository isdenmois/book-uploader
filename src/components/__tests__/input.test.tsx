import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { Text } from 'react-native';
import { Input } from '../input';
import { atom, RecoilRoot } from 'recoil';

test('Input', () => {
  const state = atom({ key: 'input', default: '' });
  const { getByTestId } = render(
    <RecoilRoot>
      <Input state={state} icon={<Text />} />
    </RecoilRoot>,
  );

  expect(getByTestId('input').props.value).toBe('');

  fireEvent(getByTestId('input'), 'onChangeText', 'test');

  expect(getByTestId('input').props.value).toBe('test');

  fireEvent.press(getByTestId('clear'));
  fireEvent.press(getByTestId('container'));

  expect(getByTestId('input').props.value).toBe('');
});
