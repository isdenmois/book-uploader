/*global jest */

type FunctionPropertyNames<T> = { [K in keyof T]: T[K] extends (...args: any[]) => any ? K : never }[keyof T] & string

export const mockPromise = <T extends {}, M extends FunctionPropertyNames<Required<T>>>(object: T, method: M) => {
  let resolvePromise: (value: any) => void, rejectPromise: (reason: any) => void
  const promise: any = new Promise((resolve, reject) => ((resolvePromise = resolve), (rejectPromise = reject)))
  let spy

  if (method in object) {
    spy = jest.spyOn(object, method).mockReturnValue(promise)
  } else {
    spy = (object[method] as any) = jest.fn().mockReturnValue(promise)
  }

  const resolve = (value: any) => resolvePromise(value)
  const reject = (value: any) => rejectPromise(value)

  return [resolve, reject, spy] as const
}

export function mockFetch() {
  const [resolve, reject, spy] = mockPromise(global, 'fetch')

  const mockedFetch = {
    spy,
    resolveText: (value: string, headers?: [string, string][]) => {
      resolve({ text: () => Promise.resolve(value), headers: new Map<string, string>(headers) })
      return mockedFetch
    },
    reject,
  }

  return mockedFetch
}
