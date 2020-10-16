import { createContext, useEffect, useCallback, useState, useMemo } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { BASE } from 'utils/request';

export const AddressContext = createContext(null);

export function useCreateAddressContext() {
  const [address, setAddress] = useState(null);
  const changeAddress = useCallback(a => {
    setAddress(a || '');

    AsyncStorage.setItem('address', a);
    BASE.URL = a ? `http://${a}:8083` : null;
  }, []);
  const context = useMemo(() => ({ address, setAddress: changeAddress }), [address]);

  useEffect(() => {
    AsyncStorage.getItem('address').then(a => {
      setAddress(a || '');
      BASE.URL = a ? `http://${a}:8083` : null;
    });
  }, []);

  return context;
}
