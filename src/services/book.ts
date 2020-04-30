import RNFS, { UploadProgressCallbackResult } from 'react-native-fs';
import { BASE } from 'utils/request';

const BOOKS_ENDPOINT = '/api/book';

interface CreateParams {
  file: any;
  author: string;
  title: string;
  cover?: any;
}

type ProgressCallback = (ev: UploadProgressCallbackResult) => void;

export async function createBook({ file, author, title, cover }: CreateParams, progress?: ProgressCallback) {
  const files = [{ name: 'file', ...file }];
  const fields: Record<string, string> = { author, title };
  const toUrl = `${BASE.URL}${BOOKS_ENDPOINT}`;

  if (cover) {
    files.push({ name: 'image', ...cover });
  }

  return RNFS.uploadFiles({ toUrl, method: 'POST', files, fields, progress }).promise;
}

export async function deleteBook(id: string) {
  const requestURL = `${BOOKS_ENDPOINT}/${id}`;
  const options = { method: 'DELETE' };
  await request(requestURL, options);
}
