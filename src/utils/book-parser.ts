import RnBgTask from 'react-native-bg-thread';
import { BookParser } from './parsers/base';
import { FB2Parser } from './parsers/fb2';
import { EpubParser } from './parsers/epub';

function runInBackground(callback): Promise<void> {
  return new Promise((resolve, reject) => {
    RnBgTask.runInBackground_withPriority('MIN', async () => {
      try {
        await callback();
        resolve();
      } catch (e) {
        console.error(e);
        reject(e);
      }
    });
  });
}

export async function parseBook(file: string, fileName: string) {
  let result: any = {};

  await runInBackground(async () => {
    fileName = fileName.toLowerCase();
    let parser: BookParser;

    if (fileName.endsWith('.epub')) {
      parser = new EpubParser(file, fileName);
    } else {
      parser = new FB2Parser(file, fileName);
    }

    await parser.parse();

    result = {
      author: parser.author,
      title: parser.title,
      file: parser.file,
      cover: parser.cover,
      destroy: () => parser.destroy(),
    };
  });

  return result;
}
