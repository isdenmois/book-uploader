import { createEvent } from 'effector'
import { ProviderType } from 'shared/api'
import { Extension } from './types'

export const setQuery = createEvent<string>()
export const setType = createEvent<ProviderType>()
export const setExtension = createEvent<Extension>()
