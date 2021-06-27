import React from 'react'
import { TouchableOpacity } from 'react-native'
import {
  useRestyle,
  spacing,
  border,
  backgroundColor,
  SpacingProps,
  BorderProps,
  BackgroundColorProps,
  VariantProps,
  createRestyleComponent,
  createVariant,
} from '@shopify/restyle'

import { Box, Theme, Text } from './theme'
import { ActivityIndicator } from './activity-indicator'

const buttonVariant = createVariant({ themeKey: 'buttonVariants' })
const ButtonContainer = createRestyleComponent<
  VariantProps<Theme, 'buttonVariants'> & React.ComponentProps<typeof Box>,
  Theme
>([buttonVariant], Box)

const restyleFunctions = [buttonVariant as any, spacing, border, backgroundColor]

type Props = SpacingProps<Theme> &
  VariantProps<Theme, 'buttonVariants'> &
  BorderProps<Theme> &
  BackgroundColorProps<Theme> & {
    onPress?: () => void
    label?: string
    outline?: boolean
    loading?: boolean
    disabled?: boolean
  }

export const Button = ({ onPress, label, loading = false, disabled = false, variant = 'primary', ...rest }: Props) => {
  const props = useRestyle(restyleFunctions, { ...rest, variant })
  const textVariant = 'button_' + variant

  return (
    <TouchableOpacity disabled={disabled || loading} onPress={onPress}>
      <ButtonContainer
        flexDirection='row'
        borderRadius={44}
        paddingVertical='1'
        paddingHorizontal='4'
        justifyContent='center'
        {...props}
      >
        {loading ? (
          <ActivityIndicator size='small' color={variant === 'secondary' ? 'primary' : 'secondary'} />
        ) : (
          <Text variant={textVariant as Partial<keyof Theme['textVariants']>}>{label}</Text>
        )}
      </ButtonContainer>
    </TouchableOpacity>
  )
}
