import { combine, createStore } from 'effector'

import { FileData, UPLOAD_STATE } from 'entities/file'
import { $uploadAddress } from 'entities/upload-address'

import { fetchFilesFx } from './effects'
import { removeFile, setProgress, updateFile } from './events'

export const $files = createStore<FileData[]>([])
export const $uploadState = createStore<UPLOAD_STATE>('IDLE')

$files.on(fetchFilesFx.doneData, (_, files) => files)
$uploadState.on(fetchFilesFx.pending, () => 'IDLE')

$files.on(removeFile, (state, toRemove) => state.filter(file => file.id !== toRemove.id))
$files.on(updateFile, (files, data) => files.map(file => (file.id === data.id ? { ...file, ...data } : file)))

/**
 * Update file progress
 */
$files.on(setProgress, (files, { id, progress }) => files.map(file => (file.id === id ? { ...file, progress } : file)))

/**
 * Combined selector to check upload availability
 */
export const $canStartUpload = combine($files, $uploadState, $uploadAddress, (files, state, address) => {
  return address && (state === 'IDLE' || state === 'HAS_ERRORS') && files?.length > 0
})
