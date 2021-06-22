import React, { FC } from 'react'
import { useStore } from 'effector-react'
import { View } from 'react-native'

import { fetchBookItemsFx } from '../model'
import { SearchChips } from './search-chips'
import { SearchQueryInput } from './search-query-input'

interface Props {
  onSubmit()
}

export const SearchFilters: FC<Props> = ({ onSubmit }) => {
  const disabled = useStore(fetchBookItemsFx.pending)

  return (
    <>
      <SearchQueryInput onSubmit={onSubmit} disabled={disabled} />

      <View>
        <SearchChips disabled={disabled} />
      </View>
    </>
  )
}
