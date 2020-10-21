import AsyncStorage from '@react-native-community/async-storage';
import { atom, selector } from 'recoil';

const ADDRESS_KEY = 'address';

const addressRawState = atom({ key: 'addressRaw', default: AsyncStorage.getItem(ADDRESS_KEY) });

export const addressState = selector<string>({
  key: 'address',
  get({ get }) {
    return get(addressRawState);
  },
  set({ set }, address: string) {
    set(addressRawState, address);
    AsyncStorage.setItem(ADDRESS_KEY, address);
  },
});
