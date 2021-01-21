import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { TouchableWithoutFeedback, View } from 'react-native';
import { DynamicStyleSheet, useDynamicStyleSheet } from 'react-native-dynamic';
import { dynamicColor } from 'theme/colors';

export function Dialog({ children }) {
  const navigation = useNavigation();
  const s = useDynamicStyleSheet(ds);

  return (
    <View style={s.container}>
      <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
        <View style={s.overlay} />
      </TouchableWithoutFeedback>

      <View style={s.content}>{children}</View>
    </View>
  );
}

const ds = new DynamicStyleSheet({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  overlay: {
    backgroundColor: '#0007',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  content: {
    backgroundColor: dynamicColor.modalBackground,
    borderRadius: 20,
    overflow: 'hidden',
  },
});
