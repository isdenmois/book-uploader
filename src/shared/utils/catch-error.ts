import { Alert } from 'react-native'

export function catchError(errorValue = null) {
  return e => {
    Alert.alert('Error', e?.message || e)

    return errorValue
  }
}

export function catchPromise<T>(promise: Promise<T>, errorValue: T = null) {
  return promise.catch(e => {
    Alert.alert('Error', e?.message || e)

    return errorValue
  })
}
