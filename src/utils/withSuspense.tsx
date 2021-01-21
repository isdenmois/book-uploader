import React, { Suspense } from 'react';
import { ActivityIndicator, Alert } from 'react-native';
import { useColor } from 'theme/colors';

export function withSuspense<T>(Component: T): T {
  const CMP: any = Component;

  return (props => {
    const color = useColor();
    const loader = <ActivityIndicator size='large' color={color.searchSelected} style={{ marginTop: 15, flex: 1 }} />;

    return (
      <Suspense fallback={loader}>
        <CMP {...props} />
      </Suspense>
    );
  }) as any;
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
