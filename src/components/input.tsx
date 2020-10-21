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
import * as colors from 'theme/colors';
import { ClearIcon } from './icons';

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
          placeholderTextColor={colors.Search}
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
