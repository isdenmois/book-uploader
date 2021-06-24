import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import { AccountIcon, SearchIcon, tabBar, UploadIcon } from 'shared/ui'

import { SearchScreen } from 'screens/search.screen'
import { UploadScreen } from 'screens/upload.screen'
import { ProfileScreen } from 'screens/profile.screen'

const Tab = createBottomTabNavigator()

const SCREENS_OPTIONS: Record<string, any> = {
  search: { color: 'searchBackground', textColor: 'searchText', icon: SearchIcon },
  upload: { color: 'uploadBackground', textColor: 'uploadText', icon: UploadIcon },
  profile: { color: 'profileBackground', textColor: 'profileText', icon: AccountIcon },
}

export function TabsNavigator() {
  return (
    <Tab.Navigator tabBar={tabBar}>
      <Tab.Screen name='Upload' component={UploadScreen} options={SCREENS_OPTIONS.upload} />
      <Tab.Screen name='Search' component={SearchScreen} options={SCREENS_OPTIONS.search} />
      <Tab.Screen name='Profile' component={ProfileScreen} options={SCREENS_OPTIONS.profile} />
    </Tab.Navigator>
  )
}
