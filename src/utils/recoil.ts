import { CallbackInterface, GetRecoilValue, RecoilState, useRecoilCallback } from 'recoil';

interface FnArgs extends CallbackInterface {
  get: GetRecoilValue;
  multiReset: (...recoilVal: RecoilState<any>[]) => void;
}

export function useSnapshotCallback(callback: (i: FnArgs) => void, deps?: ReadonlyArray<unknown>) {
  return useRecoilCallback(({ snapshot, reset, ...rest }) => {
    const get: any = a => snapshot.getLoadable(a).contents;
    const multiReset = (...args) => args.forEach(reset);

    return () => callback({ ...rest, snapshot, reset, get, multiReset });
  }, deps);
}
