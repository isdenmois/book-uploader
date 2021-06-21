import React, { useEffect } from 'react'
import RNFS from 'react-native-fs'
import { Linking } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { useNavigation } from '@react-navigation/native'
import { AccountIcon, SearchIcon, tabBar, UploadIcon } from 'shared/ui'
import { SearchScreen } from './search/search.screen'
import { UploadScreen } from './upload/upload.screen'
import { ProfileScreen } from './profile/profile.screen'

const Tab = createBottomTabNavigator()

const SCREENS_OPTIONS: Record<string, any> = {
  search: { color: 'searchBackground', textColor: 'searchText', icon: SearchIcon },
  upload: { color: 'uploadBackground', textColor: 'uploadText', icon: UploadIcon },
  profile: { color: 'profileBackground', textColor: 'profileText', icon: AccountIcon },
}

export function MainScreen() {
  useInitialScreen()

  return (
    <Tab.Navigator tabBar={tabBar}>
      <Tab.Screen name='search' component={SearchScreen} options={SCREENS_OPTIONS.search} />
      <Tab.Screen name='upload' component={UploadScreen} options={SCREENS_OPTIONS.upload} />
      <Tab.Screen name='profile' component={ProfileScreen} options={SCREENS_OPTIONS.profile} />
    </Tab.Navigator>
  )
}

const FILE_NAME = /\.(fb2|epub|fb2\.zip|zip)$/

export function useInitialScreen() {
  const navigation = useNavigation()

  useEffect(() => {
    Promise.all([RNFS.readDir(RNFS.DocumentDirectoryPath), Linking.getInitialURL()]).then(([books, initialUrl]) => {
      books = books.filter(f => f.name.match(FILE_NAME))

      if (books.length && !initialUrl) {
        navigation.navigate('upload')
      }
    })
  }, [])
}
