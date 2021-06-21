import React, { FC } from 'react'
import { Text, TouchableBox } from 'shared/ui/theme'

type Props = {
  title: string
  selected: boolean
  onPress: () => void
  disabled?: boolean
}

export const Chip: FC<Props> = ({ title, selected, disabled, onPress }) => {
  return (
    <TouchableBox
      px={2}
      py={1}
      ml={2}
      borderColor={selected ? 'searchSelected' : 'secondaryBackground'}
      backgroundColor={selected ? 'searchBackground' : null}
      borderRadius={20}
      borderWidth={1}
      disabled={disabled}
      onPress={onPress}
      testID={title}
    >
      <Text variant='chip' color={selected ? 'searchText' : 'secondary'} testID={selected ? 'selected' : null}>
        {title}
      </Text>
    </TouchableBox>
  )
}
