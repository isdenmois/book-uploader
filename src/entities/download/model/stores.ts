import { createStore } from 'effector'
import { BookItem } from 'shared/api'
import { resetDownload, setCurrentFile, setProgress } from './events'

export const $progress = createStore<number>(-1)
export const $currentFile = createStore<BookItem | null>(null)
export const $isDownloading = $progress.map(value => value >= 0)

$progress.on(setProgress, (_, value) => value).reset(resetDownload)
$currentFile.on(setCurrentFile, (_, value) => value).reset(resetDownload)
