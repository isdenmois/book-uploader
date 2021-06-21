import React from 'react'
import { render } from '@testing-library/react-native'
import { renderHook } from '@testing-library/react-hooks'
import { createAsync, mockPromise, mockPromiseValue, renderHookAsync } from 'shared/utils/test-utils/async'

import 'react-native-gesture-handler/jestSetup'
jest.mock('@react-navigation/native')
jest.mock('@react-navigation/bottom-tabs')
jest.mock('react-native-fs', () => ({}))
jest.mock('@react-native-community/async-storage', () => ({ getItem: () => null }))

import RNFS from 'react-native-fs'
import { Linking } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import { MainScreen, useInitialQuery, useInitialScreen } from '../main'

describe('Home screen', () => {
  it('should render spinner while loading deep link and files', async () => {
    const [resolveReadDir] = mockPromise(RNFS, 'readDir')
    const [resolveInitialLinking] = mockPromise(Linking, 'getInitialURL')
    const { toJSON } = render(<MainScreen />)

    expect(toJSON().type).toBe('ActivityIndicator')

    await resolveInitialLinking(null)
    expect(toJSON().type).toBe('ActivityIndicator')

    await resolveReadDir([])

    const data = toJSON()
    const searchScreen: any = data.children[0]

    expect(data.type).toBe('Navigator')
    expect(data.props.initialRouteName).toBe('search')
    expect(searchScreen.props.initialParams.initQuery).toBe('')
  })

  it('should render search screen when no deep link and files exists', async () => {
    mockPromiseValue(RNFS, 'readDir', [])
    mockPromiseValue(Linking, 'getInitialURL', null)

    const { toJSON } = await createAsync(<MainScreen />)

    const data: any = toJSON()

    expect(data.props.initialRouteName).toBe('search')
    expect(data.children[0].props.initialParams.initQuery).toBe('')
  })

  it('should render upload screen when files exists', async () => {
    mockPromiseValue(RNFS, 'readDir', [{ name: 'test.epub' }])
    mockPromiseValue(Linking, 'getInitialURL', null)

    const { toJSON } = await createAsync(<MainScreen />)

    const data: any = toJSON()

    expect(data.props.initialRouteName).toBe('upload')
  })

  it('should render search screen when deep link provided', async () => {
    ;(useNavigation as any).mockReturnValue({ dangerouslyGetState: () => null })
    mockPromiseValue(RNFS, 'readDir', [{ name: 'test.epub' }])
    mockPromiseValue(Linking, 'getInitialURL', 'booksearch://lord of the rings')

    const { toJSON } = await createAsync(<MainScreen />)

    const data: any = toJSON()

    expect(data.props.initialRouteName).toBe('search')
    expect(data.children[0].props.initialParams.initQuery).toBe('lord of the rings')
  })
})

describe('useInitialQuery', () => {
  it('should return empty string if deep linking resolving with null', async () => {
    const [resolve] = mockPromise(Linking, 'getInitialURL')
    const { result } = renderHook(() => useInitialQuery())

    expect(result.current).toBeNull()

    await resolve(null)

    expect(result.current).toBe('')
  })

  it('should return query', async () => {
    ;(useNavigation as any).mockReturnValue({ dangerouslyGetState: () => null })

    const [resolve] = mockPromise(Linking, 'getInitialURL')
    const { result } = renderHook(() => useInitialQuery())

    await resolve('booksearch://test string')

    expect(result.current).toBe('test string')
  })

  it('should return query and go to search state when navigation is ready', async () => {
    const navigate = jest.fn()
    const state = { routes: [{ name: 'home', state: {} }] }
    ;(useNavigation as any).mockReturnValue({ dangerouslyGetState: () => state, navigate })

    const [resolve] = mockPromise(Linking, 'getInitialURL')
    const { result } = renderHook(() => useInitialQuery())

    await resolve('booksearch://spellslinger')

    expect(result.current).toBe('spellslinger')
    expect(navigate).toHaveBeenCalledWith('search', { initQuery: 'spellslinger' })
  })
})

describe('useInitialScreen', () => {
  it('should return search if there is no books', async () => {
    const [resolveReadDir] = mockPromise(RNFS, 'readDir')
    mockPromiseValue(Linking, 'getInitialURL', null)

    const { result } = renderHook(() => useInitialScreen())

    expect(result.current).toBe(null)

    await resolveReadDir([{ name: 'book.no-epub' }])

    expect(result.current).toBe('search')
  })

  it('should return upload if there is some books', async () => {
    mockPromiseValue(RNFS, 'readDir', [{ name: 'some book.epub' }])
    mockPromiseValue(Linking, 'getInitialURL', null)

    const { result } = await renderHookAsync(() => useInitialScreen())

    expect(result.current).toBe('upload')
  })

  it('should return search if there is some books', async () => {
    mockPromiseValue(RNFS, 'readDir', [{ name: 'some book.epub' }])
    mockPromiseValue(Linking, 'getInitialURL', 'test')

    const { result } = await renderHookAsync(() => useInitialScreen())

    expect(result.current).toBe('search')
  })
})
