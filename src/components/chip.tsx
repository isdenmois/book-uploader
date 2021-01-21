import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { DynamicStyleSheet, useDynamicStyleSheet } from 'react-native-dynamic';
import { dynamicColor } from 'theme/colors';

type Props = {
  title: string;
  selected: boolean;
  onPress: () => void;
  disabled?: boolean;
};

export function Chip({ title, selected, disabled, onPress }: Props) {
  const s = useDynamicStyleSheet(ds);

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

const ds = new DynamicStyleSheet({
  container: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: dynamicColor.secondaryBackground,
    marginLeft: 15,
  },
  text: {
    color: dynamicColor.secondary,
    height: 18,
    fontSize: 14,
  },
  selected: {
    backgroundColor: dynamicColor.searchBackground,
    borderColor: dynamicColor.searchSelected,
  },
  selectedText: {
    color: dynamicColor.searchText,
  },
});
