import { EbookParser } from 'shared/libs'

import type { FileData } from '../model'

export function parseFile(file: FileData) {
  return EbookParser.getMetadata(file.path)
}
