import type { Component } from 'solid-js'
import { Dynamic } from 'solid-js/web'

import { useSignal } from 'shared/lib/solid-nanostore'
import { SearchPage } from 'pages/search-page'
import { LoginPage } from 'pages/login-page'

import { $showLogin } from './app-model'

export const App: Component = () => {
  const showLogin = useSignal($showLogin)

  return <Dynamic component={showLogin() ? LoginPage : SearchPage} />
}
