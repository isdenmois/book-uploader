import { NativeModules } from 'react-native';

export const EbookParser: IEbookParser = NativeModules.EbookParser;

interface IEbookParser {
  getMetadata(path: string): Promise<EbookMetadata>;
}

export interface EbookMetadata {
  title: string;
  author: string;
  file: {
    filename: string;
    filepath: string;
    filetype: string;
  };
}
