import FileOpener from 'react-native-file-opener'
import { FileData } from '../model'

export function shareFile(file: FileData) {
  const mime = file.path.endsWith('epub') ? 'application/epub' : 'application/fb2'

  FileOpener.open(file.path, mime)
}
