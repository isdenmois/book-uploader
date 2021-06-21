import React, { useEffect, useRef } from 'react'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { TextInput, StyleSheet, View, ViewStyle, ScrollView } from 'react-native'
import { SearchIcon } from 'shared/ui/icons'
import { Chip, Input } from 'shared/ui'
import { booksParams, extensionState, queryState, typeState } from './search.state'

type Props = {
  initQuery?: string
  onSearch: () => void
  disabled?: boolean
}

export function Header({ initQuery, onSearch, disabled }: Props) {
  const inputRef = useRef<TextInput>()
  const [type, setZLib, setFlibusta] = useType()
  const [extension, setEPUB, setFB2] = useExtension()
  useInitQuery(initQuery)

  useEffect(() => {
    inputRef.current?.focus()
  }, [type, extension])

  const isZLib = type === 'zlib'

  return (
    <>
      <Input
        state={queryState}
        onSubmit={onSearch}
        disabled={disabled}
        initValue={initQuery}
        placeholder='Search books by title '
        icon={<SearchIcon size={24} color='search' />}
        textInputRef={inputRef}
        autoFocus
      />

      <View>
        <ScrollView horizontal keyboardShouldPersistTaps='always'>
          <Chip title='Z-Library' selected={type === 'zlib'} onPress={setZLib} disabled={disabled} />
          <Chip title='Flibusta' selected={type === 'flibusta'} onPress={setFlibusta} disabled={disabled} />

          <View style={s.placeholder} />

          {isZLib && <Chip title='EPUB' selected={extension === 'epub'} onPress={setEPUB} disabled={disabled} />}
          {isZLib && <Chip title='FB2' selected={extension === 'fb2'} onPress={setFB2} disabled={disabled} />}
        </ScrollView>
      </View>
    </>
  )
}

function useInitQuery(initQuery) {
  const setQuery = useSetRecoilState(queryState)

  useEffect(() => {
    setQuery(initQuery || '')
  }, [initQuery])
}

export function useType() {
  const setParams = useSetRecoilState(booksParams)
  const [type, setType] = useRecoilState(typeState)

  const setZLib = () => (setType('zlib'), setParams(null))
  const setFlibusta = () => (setType('flibusta'), setParams(null))

  return [type, setZLib, setFlibusta] as const
}

function useExtension() {
  const setParams = useSetRecoilState(booksParams)
  const [extension, setExtension] = useRecoilState(extensionState)

  const setEPUB = () => (setExtension('epub'), setParams(null))
  const setFB2 = () => (setExtension('fb2'), setParams(null))

  return [extension, setEPUB, setFB2] as const
}

const s = StyleSheet.create({
  placeholder: { width: 20 } as ViewStyle,
})
