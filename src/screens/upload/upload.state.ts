import { atom, atomFamily } from 'recoil';
import RNFS from 'react-native-fs';

export interface FileData {
  id: string;
  path: string;
  ext: string;
  title: string;

  isParsed?: boolean;
  isUploaded?: boolean;

  author?: string;
  progress?: number;
  error?: string;
}

export const filesState = atom<string[]>({ key: 'files', default: [] });
export const fileFamily = atomFamily<FileData, string>({
  key: 'file',
  default: id => ({ id, path: getPath(id), ext: getExt(id), title: getTitle(id) }),
});

export type UPLOAD_STATE = 'SCAN' | 'IDLE' | 'UPLOAD' | 'FINISH' | 'HAS_ERRORS';
export const uploadState = atom<UPLOAD_STATE>({ key: 'isUploading', default: 'IDLE' });

function getPath(id) {
  return `${RNFS.DocumentDirectoryPath}/${id}`;
}

function getExt(id: string) {
  return id.replace(/.*(epub|fb2)(.zip)?$/, '$1').toUpperCase();
}

function getTitle(id: string) {
  return id.replace(/.(epub|.fb2|fb2.zip)$/, '');
}
