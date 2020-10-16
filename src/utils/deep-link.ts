import { useEffect } from 'react';
import { Linking } from 'react-native';

export function useDeepLink(onLink: (url: string) => void) {
  useEffect(() => {
    const listener = ({ url }) => onLink(url);

    Linking.getInitialURL().then(onLink);
    Linking.addEventListener('url', listener);

    return () => Linking.removeEventListener('url', listener);
  }, [onLink]);
}
