import { CallbackInterface, GetRecoilValue, RecoilState, useRecoilCallback } from 'recoil';

interface FnArgs extends CallbackInterface {
  get: GetRecoilValue;
  multiReset: (...recoilVal: RecoilState<any>[]) => void;
  merge: <T>(recoilVal: RecoilState<T>, valOrUpdater: ((currVal: T) => Partial<T>) | Partial<T>) => void;
}

export function useSnapshotCallback(callback: (i: FnArgs) => void, deps?: ReadonlyArray<unknown>) {
  return useRecoilCallback(({ snapshot, set, reset, ...rest }) => {
    const get: any = a => snapshot.getLoadable(a).contents;
    const multiReset = (...args) => args.forEach(reset);
    const merge: any = (recoilVal, valOrUpdater) =>
      set(recoilVal, val =>
        Object.assign({}, val, typeof valOrUpdater === 'function' ? valOrUpdater(val) : valOrUpdater),
      );

    return () => callback({ ...rest, snapshot, set, reset, get, multiReset, merge });
  }, deps);
}
