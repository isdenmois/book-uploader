import AsyncStorage from '@react-native-community/async-storage';
import { atom, selector } from 'recoil';
import { setBaseUrl } from 'utils/request';

const ADDRESS_KEY = 'address';

const addressRawState = atom({ key: 'addressRaw', default: AsyncStorage.getItem(ADDRESS_KEY) });

export const addressState = selector<string>({
  key: 'address',
  get({ get }) {
    const address = get(addressRawState);

    setBaseUrl(address);

    return address;
  },
  set({ set }, address: string) {
    setBaseUrl(address);
    set(addressRawState, address);
    AsyncStorage.setItem(ADDRESS_KEY, address);
  },
});
