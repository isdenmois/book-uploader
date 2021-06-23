import { createEvent } from 'effector'
import { BookItem } from 'shared/api'

export const setProgress = createEvent<number>()
export const setCurrentFile = createEvent<BookItem>()
export const resetDownload = createEvent()
