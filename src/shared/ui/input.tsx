import React, { FC, MutableRefObject, useRef } from 'react'
import { TextInput, Insets, TouchableWithoutFeedback, TextInputProps, StyleSheet } from 'react-native'
import mergeRefs from 'react-merge-refs'
import { RecoilState, useRecoilState } from 'recoil'
import { useAutofocus } from 'shared/utils'

import { ClearIcon } from './icons'
import { Box, Theme, TouchableBox, useTheme } from './theme'

type Props = {
  // TODO: remove
  state?: RecoilState<string>
  icon: React.ReactNode
  onSubmit?: () => void
  disabled?: boolean
  initValue?: string
  textColor?: keyof Theme['colors']
  textInputRef?: MutableRefObject<TextInput>
} & TextInputProps

const hitSlop: Insets = { top: 10, right: 20, bottom: 10, left: 20 }

export const Input: FC<Props> = ({
  state,
  icon,
  onSubmit,
  disabled,
  initValue,
  autoFocus,
  textColor,
  textInputRef,
  ...textInput
}) => {
  const inputRef = useAutofocus([initValue], autoFocus)
  let recoilProps = {}

  if (state) {
    recoilProps = useRecoilState(state)
  }

  const { colors } = useTheme()
  const clear = () => {
    recoilProps.onChange ? recoilProps.onChange('') : textInput.onChangeText?.('')
    inputRef.current?.focus()
  }
  const value = recoilProps.value ?? textInput.value

  return (
    <TouchableWithoutFeedback testID='container' onPress={() => inputRef.current?.focus()}>
      <Box flexDirection='row' m={2} backgroundColor='input' alignItems='center' borderRadius={10} elevation={4}>
        <Box ml={1} justifyContent='center'>
          {icon}
        </Box>

        <TextInput
          testID='input'
          style={[s.input, textColor && { color: colors[textColor] }]}
          editable={!disabled}
          onSubmitEditing={onSubmit}
          returnKeyType='search'
          placeholderTextColor={colors.search}
          ref={mergeRefs([inputRef, textInputRef])}
          autoFocus={autoFocus}
          {...recoilProps}
          {...textInput}
        />

        {!!value && !disabled && (
          <TouchableBox paddingHorizontal={1} paddingVertical={0.5} testID='clear' onPress={clear} hitSlop={hitSlop}>
            <ClearIcon />
          </TouchableBox>
        )}
      </Box>
    </TouchableWithoutFeedback>
  )
}

export function useNextInput() {
  const next = useRef<TextInput>()
  const onSubmitEditing = () => next.current?.focus()

  return [next, onSubmitEditing] as const
}

const s = StyleSheet.create({
  input: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 6,
    paddingLeft: 10,
  },
  clear: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    justifyContent: 'center',
  },
})
