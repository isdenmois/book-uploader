import { computed } from 'nanostores'
import { $auth } from 'features/auth'
import { $source } from 'features/filters'

export const $showLogin = computed([$source, $auth], (source, cookie) => source === 'ZLIB' && !cookie)
