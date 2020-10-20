import React, { Suspense } from 'react';
import { ActivityIndicator, Alert } from 'react-native';
import * as colors from 'theme/colors';

const loader = <ActivityIndicator size='large' color={colors.SearchSelected} style={{ marginTop: 15, flex: 1 }} />;

export function withSuspense<T>(Component: T): T {
  const CMP: any = Component;

  return (props => (
    <Suspense fallback={loader}>
      <CMP {...props} />
    </Suspense>
  )) as any;
}

export function catchPromise<T>(promise: Promise<T>, errorValue: T = null) {
  return promise.catch(e => {
    Alert.alert('Error', e?.message || e);

    return errorValue;
  });
}

export function catchError(errorValue = null) {
  return e => {
    Alert.alert('Error', e?.message || e);

    return errorValue;
  };
}
