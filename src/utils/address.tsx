import { createContext, useEffect, useCallback, useState, useMemo } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { BASE } from 'utils/request';

export const AddressContext = createContext(null);

export function useCreateAddressContext() {
  const [address, setAddress] = useState(null);
  const changeAddress = useCallback(a => {
    setAddress(a || '');

    AsyncStorage.setItem('address', a);
    BASE.URL = __DEV__ ? `http://${a}:4000` : `http://${a}:8080`;
  }, []);
  const context = useMemo(() => ({ address, setAddress: changeAddress }), [address]);

  useEffect(() => {
    AsyncStorage.getItem('address').then(a => {
      setAddress(a || '');
      BASE.URL = __DEV__ ? `http://${a}:4000` : `http://${a}:8080`;
    });
  }, []);

  return context;
}
