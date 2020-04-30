import xmlQuery from 'xml-query';
import translit from 'translit';
import translitRussian from 'translit-russian';
import RNFS, { UploadFileItem } from 'react-native-fs';

export type UploadFile = Pick<UploadFileItem, 'filename' | 'filepath' | 'filetype'>;

export abstract class BookParser {
  protected xq: any;
  protected t = translit(translitRussian);
  protected coverPath: string;

  constructor(public path: string, public fileName: string) {}

  abstract parse(): Promise<void>;

  author: string = '';
  title: string = '';
  file: UploadFile = null;
  cover: UploadFile = null;

  protected findByAttr(name: string, attr: string, value: any) {
    const result: any[] = [];
    this.xq.find(name).each((node: any) => {
      if (node.attributes[attr] === value) {
        result.push(node);
      }
    });

    return xmlQuery(result);
  }

  protected async createFile(filename: string, content: string) {
    const path = `${RNFS.TemporaryDirectoryPath}/${filename}`;

    await RNFS.writeFile(path, content, 'base64');

    return path;
  }

  protected async createCoverFile(filename: string, content: string) {
    this.coverPath = await this.createFile(filename, content);

    return this.coverPath;
  }

  public destroy(): Promise<any> {
    return Promise.all([RNFS.unlink(this.path), this.coverPath && RNFS.unlink(this.coverPath)]);
  }
}
