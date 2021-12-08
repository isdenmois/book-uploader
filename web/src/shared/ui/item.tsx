import { Component, Show, JSXElement } from 'solid-js'

interface Props {
  suptitle?: string
  title: string
  subtitle?: string
  onClick(): void
  icon: JSXElement
}

export const Item: Component<Props> = props => {
  return (
    <div class='flex flex-row items-center cursor-pointer' onClick={props.onClick}>
      <Show when={!!props.icon}>
        <div class='mr-1'>{props.icon}</div>
      </Show>

      <div class='flex-1'>
        <Show when={props.suptitle}>
          <div class='text-xs text-secondary'>{props.suptitle}</div>
        </Show>

        <div class='text-primary'>{props.title}</div>

        <Show when={props.subtitle}>
          <div class='text-xs text-secondary'>{props.subtitle}</div>
        </Show>
      </div>
    </div>
  )
}
