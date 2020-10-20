import React from 'react';
import { StyleSheet, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';
import * as colors from 'theme/colors';

type Props = {
  title: string;
  selected: boolean;
  onPress: () => void;
  disabled?: boolean;
};

export function Chip({ title, selected, disabled, onPress }: Props) {
  return (
    <TouchableOpacity
      style={selected ? [s.container, s.selected] : s.container}
      disabled={disabled}
      onPress={onPress}
      testID={title}
    >
      <Text style={selected ? [s.text, s.selectedText] : s.text} testID={selected ? 'selected' : null}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.SecondaryBackground,
    marginLeft: 15,
  } as ViewStyle,
  text: {
    color: colors.Secondary,
    height: 18,
    fontSize: 14,
  } as TextStyle,
  selected: {
    backgroundColor: colors.SearchBackground,
    borderColor: colors.SearchSelected,
  } as ViewStyle,
  selectedText: {
    color: colors.SearchText,
  } as TextStyle,
});
