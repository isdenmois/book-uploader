import { createStore } from 'effector'
import { setAddressEvent } from './events'

export const $uploadAdress = createStore<string | null>(null)

$uploadAdress.on(setAddressEvent, (_, address) => address)
