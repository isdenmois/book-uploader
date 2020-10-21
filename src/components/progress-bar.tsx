import React from 'react';
import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import * as colors from 'theme/colors';

type Props = {
  color: string;
  progress?: number;
};

export function ProgressBar({ color, progress }: Props) {
  if (!progress || progress <= 0) return <View style={s.empty} />;
  const progressStyle = progress < 100 ? { width: `${progress}%`, backgroundColor: color } : s.done;

  return (
    <View style={s.container}>
      <View style={s.background}>
        <View style={[s.progress, progressStyle]} />
      </View>

      <Text style={s.text}>{Math.round(progress)}%</Text>
    </View>
  );
}

const s = StyleSheet.create({
  empty: { height: 12 } as ViewStyle,
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 10,
    marginTop: 2,
  } as ViewStyle,
  background: {
    height: 5,
    position: 'relative',
    backgroundColor: colors.ProgressBackground,
    borderRadius: 2,
    overflow: 'hidden',
    flex: 1,
    marginTop: 1,
  } as ViewStyle,
  progress: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
  } as ViewStyle,
  done: {
    width: '100%',
    backgroundColor: colors.Success,
  } as ViewStyle,
  text: {
    color: colors.Secondary,
    fontSize: 12,
    width: 34,
    textAlign: 'right',
  } as TextStyle,
});
