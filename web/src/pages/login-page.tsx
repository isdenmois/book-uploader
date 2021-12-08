import { Component, createSignal } from 'solid-js'
import { setCookie } from 'features/auth'
import { api } from 'shared/api'
import { Button, Input, EmailIcon, KeyIcon } from 'shared/ui'

export const LoginPage: Component = () => {
  const [email, setEmail] = createSignal(import.meta.env.VITE_INITIAL_EMAIL)
  const [password, setPassword] = createSignal(import.meta.env.VITE_INITIAL_PASSWORD)
  const [inProgress, setInProgress] = createSignal(false)

  const login = async (e: Event) => {
    e.preventDefault()

    if (!email || !password) {
      return
    }

    setInProgress(true)

    try {
      const cookie = await api.sendLogin(email(), password())

      setCookie(cookie)
    } catch (e) {
      alert(e)
    }

    setInProgress(false)
  }

  return (
    <div class='pt-4 px-4'>
      <h1>Login</h1>

      <form class='mt-4' onSubmit={login}>
        <Input value={email()} onChange={setEmail} placeholder='E-Mail' disabled={inProgress()} icon={<EmailIcon />} />

        <div class='mt-2'>
          <Input
            value={password()}
            onChange={setPassword}
            placeholder='Password'
            disabled={inProgress()}
            type='password'
            icon={<KeyIcon />}
          />
        </div>

        <div class='mt-4 text-center'>
          <Button type='submit' disabled={inProgress()}>
            Login
          </Button>
        </div>
      </form>
    </div>
  )
}
