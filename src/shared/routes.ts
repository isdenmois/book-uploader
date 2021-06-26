import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack'

export type MainStackParamList = {
  Home: undefined
  Search: undefined
  Download: undefined
  Upload: undefined
  Profile: undefined
  Scan: { scan?: boolean }
}

export type MainStackNavigationProp<RouteName extends keyof MainStackParamList> = StackNavigationProp<
  MainStackParamList,
  RouteName
>
export type MainStackScreenProps<RouteName extends keyof MainStackParamList> = StackScreenProps<
  MainStackParamList,
  RouteName
>
