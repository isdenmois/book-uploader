import { api } from 'shared/api'
import { EbookParser } from 'shared/libs'

import { FileData, parseFile as parseFileData, removeFile as removeFileOnDisk } from 'entities/file'
import { $uploadAddress } from 'entities/upload-address'

import { fetchFilesFx } from './effects'
import { updateFile, removeFile as removeFileEvent, setUploadState, setProgress } from './events'
import { $files } from './stores'

export const fetchFiles = () => {
  fetchFilesFx()
}

export const parseFile = async (file: FileData) => {
  const parsed = await parseFileData(file)

  updateFile({
    ...file,
    path: parsed.file.filepath,
    title: parsed.title,
    author: parsed.author,
    isParsed: true,
  })
}

export const removeFile = (file: FileData) => {
  removeFileOnDisk(file)
  removeFileEvent(file)
}

export const startUpload = async () => {
  const files = $files.getState()
  const address = $uploadAddress.getState()
  let hasErrors = false

  setUploadState('UPLOAD')

  for (const file of files) {
    if (file.isUploaded) continue
    const update = (data: Partial<FileData>) => updateFile({ id: file.id, ...data })
    const updateProgress = (progress: number) => setProgress({ id: file.id, progress })

    // Set initial progress
    updateFile({ id: file.id, error: null, progress: 0.01 })

    try {
      const parsed = await EbookParser.getMetadata(file.path)

      // Update book data
      update({ title: parsed.title, author: parsed.author, isParsed: true, path: parsed.file.filepath })
      file.path = parsed.file.filepath

      await api.uploadFile(address, parsed.file, updateProgress)

      // Remove file
      await removeFileOnDisk(file)

      // Set upload status
      update({ progress: 100, isUploaded: true })
    } catch (e) {
      hasErrors = true
      update({ error: e?.responseText || e?.toString() })
      console.error(e)
    }
  }

  setUploadState(hasErrors ? 'HAS_ERRORS' : 'FINISH')
}
