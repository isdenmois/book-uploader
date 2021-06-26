import AsyncStorage from '@react-native-community/async-storage'
import { addressChanged } from './events'

const ADDRESS_KEY = 'address'

export async function preloadAddress() {
  const address = await AsyncStorage.getItem(ADDRESS_KEY)

  addressChanged(address)
}

export function setAddress(address: string) {
  addressChanged(address)

  if (address) {
    AsyncStorage.setItem(ADDRESS_KEY, address)
  } else {
    AsyncStorage.removeItem(ADDRESS_KEY)
  }
}
