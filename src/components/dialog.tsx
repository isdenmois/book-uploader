import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { TouchableWithoutFeedback, StyleSheet, View, ViewStyle } from 'react-native';
import * as colors from 'theme/colors';

export function Dialog({ children }) {
  const navigation = useNavigation();

  return (
    <View style={s.container}>
      <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
        <View style={s.overlay} />
      </TouchableWithoutFeedback>

      <View style={s.content}>{children}</View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  } as ViewStyle,
  overlay: {
    backgroundColor: '#0007',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  content: {
    backgroundColor: colors.ModalBackground,
    borderRadius: 20,
    overflow: 'hidden',
  } as ViewStyle,
});
