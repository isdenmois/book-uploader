import RNFS from 'react-native-fs'
import { createEffect } from 'effector'

import { FileData } from 'entities/file'

const FILE_NAME = /\.(fb2|epub|fb2\.zip|zip)$/

export const fetchFilesFx = createEffect(async () => {
  const allFiles = await RNFS.readDir(RNFS.DocumentDirectoryPath)

  return allFiles
    .filter(file => file.name.match(FILE_NAME))
    .map(
      file =>
        <FileData>{
          id: file.name,
          path: getPath(file.name),
          ext: getExt(file.name),
          title: getTitle(file.name),
        },
    )
})

function getPath(id) {
  return `${RNFS.DocumentDirectoryPath}/${id}`
}

function getExt(id: string) {
  return id.replace(/.*(epub|fb2)(.zip)?$/, '$1').toUpperCase()
}

function getTitle(id: string) {
  return id.replace(/.(epub|.fb2|fb2.zip)$/, '')
}
