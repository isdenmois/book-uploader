import { NativeModules } from 'react-native';

export const EbookParser: IEbookParser = NativeModules.EbookParser;

export interface EbookFileParsed {
  filename: string;
  filepath: string;
  filetype: string;
}

interface IEbookParser {
  getMetadata(path: string): Promise<EbookMetadata>;
}

export interface EbookMetadata {
  title: string;
  author: string;
  file: EbookFileParsed;
}
