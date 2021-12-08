import { computed } from 'nanostores'
import { authAtom } from 'features/auth'
import { sourceAtom } from 'features/filters'

export const $showLogin = computed([sourceAtom, authAtom], (source, cookie) => source === 'ZLIB' && !cookie)
