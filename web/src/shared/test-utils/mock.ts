/*global jest */

export function mock<T extends {}, M extends keyof T>(object: T, method: M) {
  if (method in object) {
    return jest.spyOn(object, method as any)
  }

  object[method] = jest.fn() as any

  return object[method]
}

export function mockObject<T extends {}, M extends keyof T>(object: T, method: M, value: any): T[M] {
  object[method] = value

  return value
}

export const mockLocalStorageGetItem = (value: string) => {
  jest.spyOn(window.localStorage.__proto__, 'getItem').mockReturnValue(value)
}
