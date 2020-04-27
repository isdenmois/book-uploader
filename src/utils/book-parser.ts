// import { ParsedFB2 } from 'models/parser'
// import base64 from 'utils/base64'
import RnBgTask from 'react-native-bg-thread';
import { BookParser } from './parsers/base';
import { FB2Parser } from './parsers/fb2';
import { EpubParser } from './parsers/epub';


function runInBackground(callback): Promise<void> {
  return new Promise((resolve, reject) => {
    RnBgTask.runInBackground_withPriority("MIN", async () => {
      try {
        await callback()
        resolve();
      } catch (e) {
        console.error(e)
        reject(e);
      }
    });
  })
}

export async function parseBook(file: string, fileName: string) {
  let result: any = {};

  await runInBackground(async () => {
    fileName = fileName.toLowerCase()
    let parser: BookParser

    if (fileName.endsWith('.epub')) {
      parser = new EpubParser(file, fileName)
    } else {
      parser = new FB2Parser(file, fileName)
    }

    await parser.parse()

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

// addEventListener('message', async (event: any) => {
//   const { file, type } = event.data
//   if (type !== 'PARSE_FILE') {
//     return
//   }

//   try {
//     const result = await parseBook(file)

//     postMessage(result)
//     close()
//   } catch (error) {
//     postMessage({ error: error.stack ? `${error.message}\n${error.stack}` : error.toString() })
//   }
// })
