import { atom } from 'nanostores'
import type { Extenstion, Source } from 'shared/types'

export const extAtom = atom<Extenstion>('epub')
export const queryAtom = atom('')
export const sourceAtom = atom<Source>('FLIBUSTA')
