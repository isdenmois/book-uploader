import { Component, createSignal, Show } from 'solid-js'
import { Button, Input, EmailIcon, KeyIcon, Spinner } from 'shared/ui'
import { useSignal } from 'shared/lib/solid-nanostore'
import { $inProgress, login } from './login-page-model'

export const LoginPage: Component = () => {
  const [email, setEmail] = createSignal(import.meta.env.VITE_INITIAL_EMAIL)
  const [password, setPassword] = createSignal(import.meta.env.VITE_INITIAL_PASSWORD)
  const inProgress = useSignal($inProgress)

  const onSubmit = async (e: Event) => {
    e.preventDefault()

    login(email(), password())
  }

  return (
    <div class='pt-4 px-4'>
      <h1>Login</h1>

      <form class='mt-4' onSubmit={onSubmit}>
        <Input
          name='email'
          value={email()}
          onChange={setEmail}
          placeholder='E-Mail'
          disabled={inProgress()}
          icon={<EmailIcon />}
          role='textbox'
        />

        <div class='mt-2'>
          <Input
            name='password'
            value={password()}
            onChange={setPassword}
            placeholder='Password'
            disabled={inProgress()}
            type='password'
            icon={<KeyIcon />}
            role='textbox'
          />
        </div>

        <div class='mt-4 text-center'>
          <Show when={!inProgress()} fallback={<Spinner />}>
            <Button type='submit' disabled={inProgress()}>
              Login
            </Button>
          </Show>
        </div>
      </form>
    </div>
  )
}
