import React, { MutableRefObject, useRef } from 'react';
import {
  View,
  TextStyle,
  ViewStyle,
  StyleSheet,
  TextInput,
  Insets,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TextInputProps,
} from 'react-native';
import mergeRefs from 'react-merge-refs';
import { RecoilState, useRecoilState } from 'recoil';
import { useAutofocus } from 'utils/autofocus';
import { dynamicColor, useSColor } from 'theme/colors';
import { ClearIcon } from './icons';
import { DynamicStyleSheet } from 'react-native-dynamic';

type Props = {
  state: RecoilState<string>;
  icon: React.ReactNode;
  onSubmit?: () => void;
  disabled?: boolean;
  initValue?: string;
  textColor?: string;
  textInputRef?: MutableRefObject<TextInput>;
} & TextInputProps;

const hitSlop: Insets = { top: 10, right: 20, bottom: 10, left: 20 };

export function Input(props: Props) {
  const { state, icon, onSubmit, disabled, initValue, autoFocus, textColor, textInputRef, ...textInput } = props;
  const inputRef = useAutofocus([initValue]);
  const [value, onChange] = useRecoilState(state);
  const { s, color } = useSColor(ds);

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
          placeholderTextColor={color.search}
          ref={mergeRefs([autoFocus && inputRef, textInputRef])}
          autoFocus={autoFocus}
          {...textInput}
        />

        {!!value && !disabled && (
          <TouchableOpacity testID='clear' style={s.clear} onPress={() => onChange('')} hitSlop={hitSlop}>
            <ClearIcon />
          </TouchableOpacity>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

export function useNextInput() {
  const next = useRef<TextInput>();
  const onSubmitEditing = () => next.current?.focus();

  return [next, onSubmitEditing] as const;
}

const ds = new DynamicStyleSheet({
  container: {
    flexDirection: 'row',
    margin: 15,
    marginHorizontal: 15,
    backgroundColor: dynamicColor.input,
    borderRadius: 10,
    elevation: 4,
  },
  input: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 6,
    paddingLeft: 10,
    color: dynamicColor.searchText,
  },
  icon: {
    marginLeft: 10,
    justifyContent: 'center',
  },
  clear: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    justifyContent: 'center',
  },
});
