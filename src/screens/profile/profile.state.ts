import { atom, selector } from 'recoil';
import AsyncStorage from '@react-native-community/async-storage';
import { setCookie, ZLIB_COOKIE } from 'services/api/login';

const cookieState = atom<string>({ key: 'cookie', default: AsyncStorage.getItem(ZLIB_COOKIE) });

export const profileState = selector({
  key: 'profile',
  get({ get }) {
    return get(cookieState);
  },
  set({ set }, value: string) {
    set(cookieState, value);
    setCookie(value);
  },
});
