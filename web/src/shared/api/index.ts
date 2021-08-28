import { downloadFile } from './book-download'
import { bookSearch } from './book-search'
import { sendLogin, setCookie } from './login'

export * from './types'

export const api = { bookSearch, sendLogin, setCookie, downloadFile }
