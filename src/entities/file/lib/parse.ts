import { EbookParser } from 'shared/native'

import { FileData } from '../model'

export function parseFile(file: FileData) {
  return EbookParser.getMetadata(file.path)
}
