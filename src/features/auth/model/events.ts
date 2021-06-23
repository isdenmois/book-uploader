import { createEvent } from 'effector'

export const setEmail = createEvent<string>()
export const setPassword = createEvent<string>()

export const resetAuth = createEvent()
