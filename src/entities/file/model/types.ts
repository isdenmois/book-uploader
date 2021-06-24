export type UPLOAD_STATE = 'SCAN' | 'IDLE' | 'UPLOAD' | 'FINISH' | 'HAS_ERRORS'

export interface FileData {
  id: string
  path: string
  ext: string
  title: string

  isParsed?: boolean
  isUploaded?: boolean

  author?: string
  progress?: number
  error?: string
}
