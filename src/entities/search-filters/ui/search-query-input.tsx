import { useStore } from 'effector-react'
import React, { FC, useEffect, useRef } from 'react'
import { TextInput } from 'react-native'

import { Input, SearchIcon } from 'shared/ui'
import { $searchFilters, setQuery } from '../model'

interface Props {
  onSubmit(): void
  disabled?: boolean
}

export const SearchQueryInput: FC<Props> = ({ onSubmit, disabled }) => {
  const { extension, type, query } = useStore($searchFilters)
  const inputRef = useRef<TextInput>()

  useEffect(() => {
    inputRef.current?.focus()
  }, [type, extension])

  return (
    <Input
      onSubmit={onSubmit}
      disabled={disabled}
      placeholder='Search books by title '
      icon={<SearchIcon size={24} color='search' />}
      textInputRef={inputRef}
      autoFocus
      value={query}
      onChangeText={setQuery}
      textColor='searchText'
    />
  )
}
