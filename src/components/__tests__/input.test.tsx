import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { Text } from 'react-native';
import { Input } from '../input';
import { act } from 'react-test-renderer';

test('Input', () => {
  const onChange = jest.fn();
  const { toJSON, getByTestId, update } = render(<Input value='' onChange={onChange} icon={<Text />} />);

  expect(toJSON()).toMatchSnapshot();

  fireEvent(getByTestId('input'), 'onChangeText', 'test');

  expect(onChange).toHaveBeenCalledWith('test');

  act(() => update(<Input value='test' onChange={onChange} icon={<Text />} />));

  expect(toJSON()).toMatchSnapshot();

  fireEvent.press(getByTestId('clear'));
  fireEvent.press(getByTestId('container'));

  expect(onChange).toHaveBeenCalledWith('');
});
