import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { Alert, ToastAndroid } from 'react-native';
import { mockPromise } from 'utils/test-utils/async';
jest.mock('services/api/book-download', () => ({}));
import * as api from 'services/api/book-download';
import { BookItem } from '../book-item';
import { act } from 'react-test-renderer';

test('BookItem', async () => {
  const [resolve, , downloadFile] = mockPromise(api, 'downloadFile');
  const alert = jest.spyOn(Alert, 'alert');
  const show = jest.spyOn(ToastAndroid, 'show').mockResolvedValue(undefined as never);
  const file = {
    title: 'super title',
    author: 'uauthr',
    lang: 'ru',
    translation: 'someone',
    size: '100500',
    ext: 'epub',
  };

  const { toJSON, getByTestId } = render(<BookItem item={file} />);

  expect(toJSON()).toMatchSnapshot();
  expect(downloadFile).not.toHaveBeenCalled();

  fireEvent.press(getByTestId('book-item'));
  expect(alert).toHaveBeenCalledTimes(1);
  expect(show).not.toHaveBeenCalled();

  alert.mock.calls[0][2][1].onPress(); // onSuccess;
  expect(show).toHaveBeenCalledWith('Start downloading', ToastAndroid.SHORT);
  expect(downloadFile).toHaveBeenCalledTimes(1);

  const setProgress = downloadFile.mock.calls[0][2];
  act(() => setProgress(50));

  expect(toJSON()).toMatchSnapshot();

  await resolve(null);

  expect(show).toHaveBeenCalledWith('File super-title.epub has downloaded!', ToastAndroid.SHORT);
});
