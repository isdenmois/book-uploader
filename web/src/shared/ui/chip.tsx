import { Component } from 'solid-js'
import './styles/chip.css'

interface Props {
  title: string
  selected?: boolean
  disabled?: boolean
  onSelect: () => void
}

export const Chip: Component<Props> = props => {
  return (
    <button class='chip' classList={{ selected: props.selected }} disabled={props.disabled} onClick={props.onSelect}>
      {props.title}
    </button>
  )
}
