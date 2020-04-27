import JSZip from 'jszip';
import XmlReader from 'xml-reader';
import xmlQuery from 'xml-query';
import RNFS from 'react-native-fs';
import { BookParser, BookCover } from './base';

export class EpubParser extends BookParser {
  async parse() {
    const epub = new JSZip();
    const file = await RNFS.readFile(this.path, 'base64');

    await epub.loadAsync(file, { base64: true });

    const contents = epub.file(/\.opf$/)

    if (!contents.length) return
    const contentPath = contents[0].name
    const dir = contentPath.substring(0, contentPath.lastIndexOf('/'))
    const xml: string = await contents[0].async('text')
    const ast = XmlReader.parseSync(xml)

    this.xq = xmlQuery(ast);

    this.author = this.getDcText('creator');
    this.title = this.getDcText('title');

    const author = this.author.replace(/\s+/g, '-').toLowerCase()
    const title = this.title.replace(/\s+/g, '-').toLowerCase()

    this.file = {
      filename: `${author}_${title}.epub`,
      filepath: this.path,
      filetype: 'application/epub',
    }
    this.cover = await this.parseCover(epub, dir, `${author}_${title}`)
  }

  private async parseCover(zip: JSZip, dir: string, fileName: string) {
    const coverNode = this.findByAttr('meta', 'name', 'cover')
    const coverId = coverNode.attr('content')

    if (!coverId) return null

    const itemNode = this.findByAttr('item', 'id', coverId)
    const href = itemNode.attr('href')
    const fileZip = zip.file(dir ? `${dir}/${href}` : href)

    if (!fileZip) return null

    const content = await fileZip.async('base64')
    const ext = href.slice(href.lastIndexOf('.'))
    const filename = this.t(fileName + ext).toLowerCase()

    return {
      filename,
      filepath: await this.createCoverFile(filename, content),
      filetype: itemNode.attr('media-type'),
    };
  }

  private getDcText(path: string) {
    return this.xq.find(path).text() || this.xq.find(`dc:${path}`).text()
  }
}
