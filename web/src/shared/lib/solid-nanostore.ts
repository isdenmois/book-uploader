import { createSignal, onCleanup } from 'solid-js'
import type { ReadableAtom } from 'nanostores'

export function useSignal<T>(store: ReadableAtom<T>) {
  const [state, setState] = createSignal(store.get())

  const unsubscribe = store.subscribe((newValue: any) => {
    setState(newValue)
  })

  onCleanup(() => unsubscribe())

  return state
}
