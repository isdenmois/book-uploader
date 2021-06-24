import { createEvent } from 'effector'
import { FileData, UPLOAD_STATE } from 'entities/file'

export const removeFile = createEvent<FileData>()
export const updateFile = createEvent<Partial<FileData> & { id: string }>()
export const setProgress = createEvent<{ id: string; progress: number }>()
export const setUploadState = createEvent<UPLOAD_STATE>()
