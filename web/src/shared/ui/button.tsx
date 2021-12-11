import { Component } from 'solid-js'
import './styles/button.css'

interface Props {
  disabled?: boolean
  type?: 'submit' | 'reset' | 'button'
}

export const Button: Component<Props> = props => {
  return (
    <button class='button' disabled={props.disabled} type={props.type} role='button'>
      {props.children}
    </button>
  )
}
