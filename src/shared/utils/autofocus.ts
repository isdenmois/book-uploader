import { useFocusEffect } from '@react-navigation/native'
import { useCallback, useEffect, useRef } from 'react'
import { TextInput } from 'react-native'

export function useAutofocus(deps: ReadonlyArray<any>, enabled: boolean) {
  const inputRef = useRef<TextInput>()
  const focus = useCallback(() => {
    if (enabled) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [...deps, enabled])

  useEffect(focus, [focus])
  useFocusEffect(focus)

  return inputRef
}
