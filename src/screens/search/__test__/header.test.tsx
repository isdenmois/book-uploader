import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { act, renderHook } from '@testing-library/react-hooks';
import 'react-native-gesture-handler/jestSetup';
import { Header, useSearch } from '../header';

test('Search header ', () => {
  const onSearch = jest.fn();
  const { getByTestId } = render(<Header initQuery='  test ' onSearch={onSearch} />);

  fireEvent(getByTestId('input'), 'onSubmitEditing');

  expect(onSearch).toHaveBeenCalledWith('test');
});

test('useSearch', () => {
  const onSearch = jest.fn();
  let initQuery = null;
  const { result, rerender } = renderHook(() => useSearch(onSearch, initQuery));
  let [query, setQuery, toSearch] = result.current;

  expect(query).toBe('');

  act(() => setQuery('query '));
  [query, , toSearch] = result.current;

  expect(query).toBe('query ');
  expect(onSearch).not.toHaveBeenCalled();

  act(() => toSearch());
  [query] = result.current;

  expect(query).toBe('query');
  expect(onSearch).toHaveBeenCalledWith('query');

  initQuery = 'planetfall';
  rerender();
  [query] = result.current;

  expect(query).toBe('planetfall');
});
