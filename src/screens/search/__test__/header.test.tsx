import React from 'react';
import { RecoilRoot } from 'recoil';
import { fireEvent, render } from '@testing-library/react-native';
import 'react-native-gesture-handler/jestSetup';
jest.mock('@react-native-community/async-storage', () => ({}));
import { Header } from '../header';

test('Search header ', () => {
  const onSearch = jest.fn();
  const { getByTestId } = render(
    <RecoilRoot>
      <Header initQuery='  test ' onSearch={onSearch} />
    </RecoilRoot>,
  );
  const isSelected = testID => getByTestId(testID).props.children[0].props.testID === 'selected';

  expect(getByTestId('input').props.value).toBe('  test ');

  fireEvent.press(getByTestId('Flibusta'));
  expect(isSelected('Z-Library')).toBeFalsy();
  expect(isSelected('Flibusta')).toBeTruthy();

  fireEvent.press(getByTestId('Z-Library'));
  expect(isSelected('Z-Library')).toBeTruthy();
  expect(isSelected('Flibusta')).toBeFalsy();
});
