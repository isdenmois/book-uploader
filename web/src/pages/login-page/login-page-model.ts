import { atom } from 'nanostores'
import { setCookie } from 'features/auth'
import { api } from 'shared/api'

export const $inProgress = atom(false)

export const login = async (email: string, password: string) => {
  email = email?.trim()
  password = password?.trim()

  if (!email || !password) {
    return
  }

  $inProgress.set(true)

  try {
    const cookie = await api.sendLogin(email, password)

    setCookie(cookie)
  } catch (e) {
    alert(e)
  }

  $inProgress.set(false)
}
