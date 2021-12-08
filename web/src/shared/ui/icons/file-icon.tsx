import type { Component } from 'solid-js'

interface Props {
  text: string
}

export const FileIcon: Component<Props> = props => {
  return (
    <svg viewBox='0 0 40 50' width='40' height='40'>
      <path
        d='M24 0H2.4A2.394 2.394 90 000 2.388V48.8a2.394 2.394 90 002.388 2.4H36a2.394 2.394 90 002.4-2.388V14.4H25.6a1.6 1.6 90 01-1.6-1.6zm14.4 12.19v.61H27.2a1.6 1.6 90 01-1.6-1.6V0h.61a2.4 2.4 90 011.7.7l9.79 9.8a2.39 2.39 90 01.7 1.69z'
        fill='var(--searchSelected)'
      />
      <text fill='#fff' font-size='12' font-weight='bold' x='19' y='44' text-anchor='middle'>
        {props.text.toUpperCase()}
      </text>
    </svg>
  )
}
