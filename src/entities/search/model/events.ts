import { createEvent } from 'effector'
import { Extension, SearchType } from './types'

export const setQuery = createEvent<string>()

export const setType = createEvent<SearchType>()
export const setExtension = createEvent<Extension>()
