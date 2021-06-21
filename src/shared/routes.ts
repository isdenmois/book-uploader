import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack'

type MainStackParamList = {
  Home: undefined
}

export type MainStackNavigationProp<RouteName extends keyof MainStackParamList> = StackNavigationProp<
  MainStackParamList,
  RouteName
>
export type MainStackScreenProps<RouteName extends keyof MainStackParamList> = StackScreenProps<
  MainStackParamList,
  RouteName
>
