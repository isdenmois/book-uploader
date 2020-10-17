import { useEffect, useRef } from 'react';
import { TextInput } from 'react-native';

export function useAutofocus(deps: any[]) {
  const inputRef = useRef<TextInput>();

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100);
  }, deps);

  return inputRef;
}
