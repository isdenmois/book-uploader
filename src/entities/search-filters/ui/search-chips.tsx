import React, { FC } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { useStore } from 'effector-react'

import { Chip } from 'shared/ui'

import { $searchFilters, setEpub, setFb2, setFlibusta, setZLib } from '../model'

interface Props {
  disabled?: boolean
}

export const SearchChips: FC<Props> = ({ disabled }) => {
  const { extension, type } = useStore($searchFilters)
  const isZLib = type === 'ZLIB'

  return (
    <ScrollView horizontal keyboardShouldPersistTaps='always'>
      <Chip title='Z-Library' selected={type === 'ZLIB'} onPress={setZLib} disabled={disabled} />
      <Chip title='Flibusta' selected={type === 'FLIBUSTA'} onPress={setFlibusta} disabled={disabled} />

      <View style={s.placeholder} />

      {isZLib && <Chip title='EPUB' selected={extension === 'epub'} onPress={setEpub} disabled={disabled} />}
      {isZLib && <Chip title='FB2' selected={extension === 'fb2'} onPress={setFb2} disabled={disabled} />}
    </ScrollView>
  )
}

const s = StyleSheet.create({
  placeholder: { width: 20 },
})
