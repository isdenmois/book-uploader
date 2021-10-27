import { NativeModules } from 'react-native'

export const FileOpener: IFileOpener = NativeModules.FileOpener

interface IFileOpener {
  open(file: string, contentType: string): Promise<String>
}
