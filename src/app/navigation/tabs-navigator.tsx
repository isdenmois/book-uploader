import React, { useCallback } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { useNavigation } from '@react-navigation/native'

import { AccountIcon, SearchIcon, tabBar, UploadIcon } from 'shared/ui'
import { useDeepLink } from 'shared/utils'
import { setQuery } from 'entities/search-filters'
import { MainStackParamList, MainStackNavigationProp } from 'shared/routes'

import { SearchScreen } from 'screens/search.screen'
import { UploadScreen } from 'screens/upload.screen'
import { ProfileScreen } from 'screens/profile.screen'

const Tab = createBottomTabNavigator<MainStackParamList>()

const SCREENS_OPTIONS: Record<string, any> = {
  search: { color: 'searchBackground', textColor: 'searchText', icon: SearchIcon },
  upload: { color: 'uploadBackground', textColor: 'uploadText', icon: UploadIcon },
  profile: { color: 'profileBackground', textColor: 'profileText', icon: AccountIcon },
}

export function TabsNavigator() {
  useInitialQuery()

  return (
    <Tab.Navigator tabBar={tabBar} screenOptions={{ headerShown: false }}>
      <Tab.Screen name='Upload' component={UploadScreen} options={SCREENS_OPTIONS.upload} />
      <Tab.Screen name='Search' component={SearchScreen} options={SCREENS_OPTIONS.search} />
      <Tab.Screen name='Profile' component={ProfileScreen} options={SCREENS_OPTIONS.profile} />
    </Tab.Navigator>
  )
}

function useInitialQuery() {
  const navigation = useNavigation<MainStackNavigationProp<'Home'>>()
  const onLink = useCallback(link => {
    if (link) {
      link = link.replace('booksearch://', '')
      navigation.navigate('Search')
    }

    setQuery(link || '')
  }, [])

  useDeepLink(onLink)
}
