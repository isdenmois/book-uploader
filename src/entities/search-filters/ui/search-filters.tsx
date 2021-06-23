import React, { FC } from 'react'
import { View } from 'react-native'

import { SearchChips } from './search-chips'
import { SearchQueryInput } from './search-query-input'

interface Props {
  onSubmit()
  disabled?: boolean
}

export const SearchFilters: FC<Props> = ({ onSubmit, disabled }) => {
  return (
    <>
      <SearchQueryInput onSubmit={onSubmit} disabled={disabled} />

      <View>
        <SearchChips disabled={disabled} />
      </View>
    </>
  )
}
