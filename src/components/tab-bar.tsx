import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import * as colors from 'theme/colors';
import { AccountIcon, SearchIcon, UploadIcon } from './icons';

const COLORS = {
  search: [colors.SearchBackground, colors.SearchText],
  upload: [colors.UploadBackground, colors.UploadText],
  profile: [colors.ProfileBackground, colors.ProfileText],
};
const ICONS = {
  search: SearchIcon,
  upload: UploadIcon,
  profile: AccountIcon,
};

export function TabBar({ state, descriptors, navigation }) {
  const focusedOptions = descriptors[state.routes[state.index].key].options;

  if (focusedOptions.tabBarVisible === false) {
    return null;
  }

  return (
    <View style={s.container}>
      {state.routes.map((route, index) => {
        const routeName = route.name;
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const [backgroundColor, textColor] = COLORS[routeName];
        const Icon = ICONS[routeName];

        return (
          <TouchableOpacity key={route.name} onPress={onPress} style={s.tab}>
            <View style={[s.tabRound, { backgroundColor: isFocused ? backgroundColor : null }]}>
              <Icon size={25} color={isFocused ? textColor : colors.TabText} fill={isFocused} />
              {isFocused && <Text style={[s.text, { color: textColor }]}>{capitalize(route.name)}</Text>}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function capitalize(str: string) {
  return str[0].toUpperCase() + str.slice(1);
}

const s = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.TabsBackground,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0, 0, 0, .16)',
    elevation: 8,
  } as ViewStyle,
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center' } as ViewStyle,
  tabRound: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 7,
    borderRadius: 32,
    alignItems: 'center',
  } as ViewStyle,
  text: {
    marginLeft: 6,
  } as TextStyle,
});
