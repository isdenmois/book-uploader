import RNFS from 'react-native-fs';

type ProgressCallback = (progress: number) => void;

export async function uploadFile(address: string, file: any, setProgress?: ProgressCallback) {
  const files = [{ name: 'file', ...file }];
  const md5 = await RNFS.hash(file.filepath, 'md5');
  const stat = await RNFS.stat(file.filepath);
  const size = stat.size?.toString() || '0';

  const fields: Record<string, string> = {
    md5,
    size,
    file_name: file.filename,
    file_md5: md5,
  };
  const headers: Record<string, string> = {
    current_chunk: '0',
    total_chunk: '1',
    md5,
    size,
  };

  return RNFS.uploadFiles({
    toUrl: getUrl(address),
    method: 'POST',
    files,
    fields,
    headers,
    progress: ev => setProgress((ev.totalBytesSent / ev.totalBytesExpectedToSend) * 100),
  }).promise;
}

function getUrl(address: string) {
  return `http://${address}:8080/upload`;
}
