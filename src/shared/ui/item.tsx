import React, { ComponentProps, FC, ReactNode } from 'react'
import { Box, Text, Theme, TouchableBox } from './theme'

type ItemComposition = {
  Text: typeof ItemText
}

type Props = ComponentProps<typeof TouchableBox> & {
  progress?: ReactNode
}

const ItemBox: FC<Props> = ({ children, progress, ...props }) => {
  return (
    <TouchableBox {...props}>
      <Box flexDirection='row' alignItems='center'>
        {children}
      </Box>

      {progress}
    </TouchableBox>
  )
}

type ItemTextProps = {
  title: string
  suptitle?: string
  subtitle?: string
  error?: string
  color?: keyof Theme['colors']
}

const ItemText: FC<ItemTextProps> = ({ title, suptitle, subtitle, color = 'searchText', error }) => {
  return (
    <Box ml={1} flex={1}>
      {!!suptitle && !error && <Text variant='secondary'>{suptitle}</Text>}

      <Text color={color}>{title}</Text>
      {!!subtitle && !error && <Text variant='secondary'>{subtitle}</Text>}

      {!!error && (
        <Text variant='secondary' color='error'>
          {error}
        </Text>
      )}
    </Box>
  )
}

export const Item: typeof ItemBox & ItemComposition = ItemBox as any

Item.Text = ItemText
