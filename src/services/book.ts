import RNFS, { ReadDirItem, UploadProgressCallbackResult } from 'react-native-fs';
import { BASE } from 'utils/request'

const BOOKS_ENDPOINT = '/api/book'

interface CreateBookParams {
  file: any
  author: string
  title: string
  cover?: any
}

export async function createBook(
  { file, author, title, cover }: CreateBookParams,
  progress?: (ev: UploadProgressCallbackResult) => void,
) {
  const files = [{ name: 'file', ...file }];
  const fields: any = { author, title };
  const toUrl = `${BASE.URL}${BOOKS_ENDPOINT}`;

  if (cover) {
    fields['image-name'] = cover.filename;
    files.push({ name: 'image', ...cover });
  }

  return RNFS.uploadFiles({ toUrl, method: 'POST', files, fields, progress }).promise;
}

export async function deleteBook(id: string) {
  const requestURL = `${BOOKS_ENDPOINT}/${id}`
  const options = { method: 'DELETE' }
  await request(requestURL, options)
}
