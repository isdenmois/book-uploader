import RNFS, { UploadProgressCallbackResult } from 'react-native-fs';
import { BASE, request } from 'utils/request';

const BOOKS_ENDPOINT = '/upload';

interface CreateParams {
  file: any;
}

type ProgressCallback = (ev: UploadProgressCallbackResult) => void;

export async function createBook({ file }: CreateParams, progress?: ProgressCallback) {
  const files = [{ name: 'file', ...file }];
  const toUrl = `${BASE.URL}${BOOKS_ENDPOINT}`;
  const md5 = await RNFS.hash(file.filepath, 'md5');
  const stat = await RNFS.stat(file.filepath);
  const size = stat.size?.toString() || '0';

  const fields: Record<string, string> = {
    md5,
    size,
    file_name: file.filename,
    file_md5: md5,
  };
  const headers: Record<string, string> = {
    current_chunk: '0',
    total_chunk: '1',
    md5,
    size,
  };

  return RNFS.uploadFiles({ toUrl, method: 'POST', files, fields, headers, progress }).promise;
}

export async function deleteBook(id: string) {
  const requestURL = `${BOOKS_ENDPOINT}/${id}`;
  const options = { method: 'DELETE' };
  await request(requestURL, options);
}
