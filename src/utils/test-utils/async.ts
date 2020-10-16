import { renderHook, RenderHookOptions, RenderHookResult } from '@testing-library/react-hooks';
import { act } from '@testing-library/react-native';
import { create, ReactTestRenderer } from 'react-test-renderer';

/*global jest */

type FunctionPropertyNames<T> = { [K in keyof T]: T[K] extends (...args: any[]) => any ? K : never }[keyof T] & string;

export const mockPromise = <T extends {}, M extends FunctionPropertyNames<Required<T>>>(object: T, method: M) => {
  let resolvePromise;
  const promise: any = new Promise(resolve => (resolvePromise = resolve));

  if (method in object) {
    jest.spyOn(object, method).mockReturnValue(promise);
  } else {
    (object[method] as any) = () => promise;
  }

  const resolve = value => act(async () => resolvePromise(value));

  return [resolve] as const;
};

export const mockPromiseValue = (obj, prop, value) => {
  const promise = Promise.resolve(value);

  if (prop in obj) {
    jest.spyOn(obj, prop).mockReturnValue(promise);
  } else {
    obj[prop] = () => promise;
  }
};

export const createAsync = async (elem): Promise<ReactTestRenderer> => {
  let result: ReactTestRenderer;

  await act(async () => (result = create(elem)));

  return result;
};

export const immediate = () => new Promise(resolve => setImmediate(resolve));

export async function renderHookAsync<P, R>(
  callback: (props: P) => R,
  options?: RenderHookOptions<P>,
): Promise<RenderHookResult<P, R>> {
  let result: RenderHookResult<P, R>;

  await act(async () => (result = renderHook(callback, options)));

  return result;
}

export function mock<T extends {}, M extends FunctionPropertyNames<Required<T>>>(object: T, method: M) {
  if (method in object) {
    return jest.spyOn(object, method);
  }

  return ((object[method] as any) = () => jest.fn());
}
