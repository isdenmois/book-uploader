import JSZip from 'jszip'
import XmlReader from 'xml-reader'
import xmlQuery from 'xml-query'
import RNFS from 'react-native-fs';
import base64 from 'base-64'
import utf8 from 'utf8'
import { BookParser } from './base'

export class FB2Parser extends BookParser {
  private description: any
  private titleInfo: any
  private publishInfo: any

  private extractedPath: string;

  async parse() {
    let content: string;
    const file = await RNFS.readFile(this.path, 'base64');

    if (this.fileName.endsWith('.zip')) {
      const data = await unzipFile(file);

      this.extractedPath = await this.createFile(data.fileName, data.blob);

      content = data.content;

      this.file = {
        filename: data.fileName,
        filepath: this.extractedPath,
        filetype: 'application/fb2',
      };
    } else {
      content = utf8.decode(base64.decode(file));

      this.file = {
        filename: this.fileName,
        filepath: this.path,
        filetype: 'application/fb2',
      };
    }

    this.parseContent(content);
    await this.parseCover();
  }

  private parseContent(content: string) {
    const ast = XmlReader.parseSync(content)

    this.xq = xmlQuery(ast)
    this.description = this.xq.find('description')
    this.titleInfo = this.description.find('title-info')
    this.publishInfo = this.description.find('publish-info')

    const authorNode = this.titleInfo.find('author');
    const firstName = authorNode.find('first-name').text()
    const lastName = authorNode.find('last-name').text()

    this.author = `${firstName} ${lastName}`
    this.title = this.titleInfo.find('book-title').text();
  }

  private async parseCover() {
    let id = this.titleInfo
      .find('coverpage')
      .find('image')
      .attr('l:href')

    if (!id) {
      return null
    }

    id = id.replace('#', '')
    const binary = this.findByAttr('binary', 'id', id).first()
    const ext = id.slice(id.lastIndexOf('.'))

    if (binary.length === 0) {
      return null
    }

    let fileName = `${this.author}_${this.title}${ext}`.replace(/\s+/g, '_').toLowerCase();
    fileName = this.t(fileName);

    this.cover = {
      filename: fileName,
      filepath: await this.createCoverFile(fileName, binary.text()),
      filetype: binary.attr('content-type'),
    }
  }

  public destroy() {
    return Promise.all([super.destroy(), this.extractedPath && RNFS.unlink(this.extractedPath)]);
  }
}

async function unzipFile(file: string) {
  const zip = new JSZip();

  await zip.loadAsync(file, { base64: true });

  const zipFile = zip.file(/\.fb2$/)[0];
  const content = await zipFile.async('text');
  const blob = await zipFile.async('base64');

  return { content, blob, fileName: zipFile.name };
}
