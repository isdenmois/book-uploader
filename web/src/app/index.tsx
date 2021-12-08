import { render } from 'solid-js/web'
import 'virtual:windi.css'

import { App } from './app'

render(() => <App />, document.getElementById('app') as HTMLElement)
