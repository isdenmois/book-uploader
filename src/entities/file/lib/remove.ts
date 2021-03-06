import RNFS from 'react-native-fs'
import type { FileData } from '../model'

export async function removeFile(file: FileData) {
  return RNFS.unlink(file.path)
}
