import { restore } from 'effector'
import { addressChanged } from './events'

export const $uploadAddress = restore<string | null>(addressChanged, null)
