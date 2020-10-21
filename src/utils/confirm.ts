import { Alert } from 'react-native';

export function useConfirm(title, message, onSuccess) {
  return () => {
    confirm(title, message, onSuccess);
  };
}

export function confirm(title: string, message: string, onSuccess) {
  Alert.alert(title, message, [
    {
      text: 'Cancel',
      style: 'cancel',
    },
    { text: 'OK', onPress: onSuccess, style: 'destructive' },
  ]);
}
