import { Component, Show, JSXElement } from 'solid-js'
import { CloseIcon } from './icons'

interface Props {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  type?: string
  icon?: JSXElement
  role?: any
}

export const Input: Component<Props> = props => {
  return (
    <div class='input flex relative items-center'>
      <span class='absolute inset-y-0 left-0 flex items-center pl-2' v-if='$slots.icon'>
        <Show when={!!props.icon}>{props.icon}</Show>
      </span>

      <input
        class='flex-1 py-2 rounded-md pl-10'
        placeholder={props.placeholder}
        value={props.value}
        type={props.type}
        disabled={props.disabled}
        onChange={(e: any) => props.onChange(e.target.value)}
        role={props.role}
      />

      <Show when={props.value && !props.disabled}>
        <div class='cursor-pointer px-2 z-10' onClick={() => props.onChange('')} data-testid='clear'>
          <CloseIcon />
        </div>
      </Show>
    </div>
  )
}
