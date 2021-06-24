import AsyncStorage from '@react-native-community/async-storage'
import { setAddressEvent } from './events'

const ADDRESS_KEY = 'address'

export async function preloadAddress() {
  const address = await AsyncStorage.getItem(ADDRESS_KEY)

  setAddressEvent(address)
}

export function setAddress(address: string) {
  setAddressEvent(address)

  if (address) {
    AsyncStorage.setItem(ADDRESS_KEY, address)
  } else {
    AsyncStorage.removeItem(ADDRESS_KEY)
  }
}
