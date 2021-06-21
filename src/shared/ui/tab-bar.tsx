import React from 'react'
import { TouchableOpacity, StyleSheet } from 'react-native'

import { Box, Text } from './theme'

export const tabBar = props => <TabBar {...props} />

export function TabBar({ state, descriptors, navigation }) {
  const { tabBarVisible } = descriptors[state.routes[state.index].key].options

  if (tabBarVisible === false) {
    return null
  }

  return (
    <Box style={s.container} backgroundColor='tabsBackground'>
      {state.routes.map((route, index) => {
        const { color, textColor, icon: Icon } = descriptors[route.key].options
        const isFocused = state.index === index

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          })

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name)
          }
        }

        return (
          <TouchableOpacity key={route.name} onPress={onPress} style={s.tab}>
            <Box style={s.tabRound} backgroundColor={isFocused ? color : null}>
              <Icon size={25} color={isFocused ? textColor : 'tabText'} fill={isFocused} />

              {isFocused && (
                <Text style={s.text} color={textColor}>
                  {capitalize(route.name)}
                </Text>
              )}
            </Box>
          </TouchableOpacity>
        )
      })}
    </Box>
  )
}

function capitalize(str: string) {
  return str[0].toUpperCase() + str.slice(1)
}

const s = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0, 0, 0, .16)',
    elevation: 8,
  },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center' },
  tabRound: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 7,
    borderRadius: 32,
    alignItems: 'center',
  },
  text: {
    marginLeft: 6,
  },
})
