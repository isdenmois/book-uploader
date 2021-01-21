import React from 'react';
import { Text, View } from 'react-native';
import { DynamicStyleSheet, useDynamicStyleSheet } from 'react-native-dynamic';
import { dynamicColor } from 'theme/colors';

type Props = {
  color: string;
  progress?: number;
  showAlways?: boolean;
  text?: string;
};

export function ProgressBar({ color, progress, showAlways, text }: Props) {
  const s = useDynamicStyleSheet(ds);
  if (!showAlways && (!progress || progress <= 0)) return <View style={s.empty} />;
  const progressStyle = progress < 100 ? { width: `${progress}%`, backgroundColor: color } : s.done;

  return (
    <View style={s.container}>
      <View style={s.background}>
        <View style={[s.progress, progressStyle]} />
      </View>

      <Text style={s.text}>{text || Math.round(progress) + '%'}</Text>
    </View>
  );
}

const ds = new DynamicStyleSheet({
  empty: { height: 12 },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 10,
    marginTop: 2,
  },
  background: {
    height: 5,
    position: 'relative',
    backgroundColor: dynamicColor.progressBackground,
    borderRadius: 2,
    overflow: 'hidden',
    flex: 1,
    marginTop: 1,
  },
  progress: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
  },
  done: {
    width: '100%',
    backgroundColor: dynamicColor.success,
  },
  text: {
    color: dynamicColor.secondary,
    fontSize: 12,
    minWidth: 34,
    paddingLeft: 5,
    textAlign: 'right',
  },
});
