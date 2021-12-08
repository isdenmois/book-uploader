import { Component } from 'solid-js'

import { useSignal } from 'shared/lib/solid-nanostore'
import { Input, SearchIcon } from 'shared/ui'

import { $query } from '../model'

interface Props {
  disabled?: boolean
}

export const SearchInput: Component<Props> = props => {
  const query = useSignal($query)

  return (
    <Input
      value={query()}
      onChange={$query.set}
      placeholder='Search books by title'
      disabled={props.disabled}
      icon={<SearchIcon />}
      role='searchbox'
    />
  )
}
