import { MMKV } from 'shared/libs'
import { addressChanged } from './events'

const ADDRESS_KEY = 'address'

export async function preloadAddress() {
  addressChanged(MMKV.getString(ADDRESS_KEY))
}

export function setAddress(address: string) {
  addressChanged(address)

  if (address) {
    MMKV.setString(ADDRESS_KEY, address)
  } else {
    MMKV.removeItem(ADDRESS_KEY)
  }
}
