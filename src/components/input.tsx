import React from 'react';
import {
  View,
  TextStyle,
  ViewStyle,
  StyleSheet,
  TextInput,
  Insets,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { useAutofocus } from 'utils/autofocus';
import * as colors from 'theme/colors';
import { ClearIcon } from './icons';

type Props = {
  value: string;
  onChange: (value: string) => void;
  icon: React.ReactNode;
  onSubmit?: () => void;
  disabled?: boolean;
  autoFocus?: boolean;
  initValue?: string;
  textColor?: string;
};

const hitSlop: Insets = { top: 10, right: 20, bottom: 10, left: 20 };

export function Input({ value, icon, onChange, onSubmit, disabled, initValue, autoFocus, textColor }: Props) {
  const inputRef = useAutofocus([initValue]);

  return (
    <TouchableWithoutFeedback testID='container' onPress={() => inputRef.current?.focus()}>
      <View style={s.container}>
        <View style={s.icon}>{icon}</View>

        <TextInput
          testID='input'
          style={[s.input, textColor && { color: textColor }]}
          editable={!disabled}
          value={value}
          onChangeText={onChange}
          onSubmitEditing={onSubmit}
          returnKeyType='search'
          placeholder='Search books'
          placeholderTextColor={colors.Search}
          ref={autoFocus && inputRef}
          autoFocus={autoFocus}
        />

        {!!value && (
          <TouchableOpacity testID='clear' style={s.clear} onPress={() => onChange('')} hitSlop={hitSlop}>
            <ClearIcon />
          </TouchableOpacity>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

const s = StyleSheet.create({
  container: {
    flexDirection: 'row',
    margin: 15,
    marginHorizontal: 15,
    backgroundColor: colors.Input,
    borderRadius: 10,
    elevation: 4,
  } as ViewStyle,
  input: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 6,
    paddingLeft: 10,
    color: colors.SearchText,
  } as TextStyle,
  icon: {
    marginLeft: 10,
    justifyContent: 'center',
  } as ViewStyle,
  clear: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    justifyContent: 'center',
  } as ViewStyle,
});
