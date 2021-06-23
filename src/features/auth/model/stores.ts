import { combine, createStore } from 'effector'
import { INITIAL_EMAIL, INITIAL_PASSWORD } from '@env'
import { resetAuth, setEmail, setPassword } from './events'

export const $email = createStore<string>(INITIAL_EMAIL)
export const $password = createStore<string>(INITIAL_PASSWORD)

$email.on(setEmail, (_, value) => value).reset(resetAuth)
$password.on(setPassword, (_, value) => value).reset(resetAuth)

export const $isAuthValid = combine($email, $password, (email, password) => Boolean(email && password))
