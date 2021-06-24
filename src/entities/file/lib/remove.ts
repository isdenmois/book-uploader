import RNFS from 'react-native-fs'
import { FileData } from '../model'

export async function removeFile(file: FileData) {
  return RNFS.unlink(file.path)
}
