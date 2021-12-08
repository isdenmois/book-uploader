import { atom } from 'nanostores'
import type { Extenstion, Source } from 'shared/types'

export const $ext = atom<Extenstion>('epub')
export const $query = atom('')
export const $source = atom<Source>('FLIBUSTA')
