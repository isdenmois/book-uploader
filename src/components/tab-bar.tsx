import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { DynamicStyleSheet, useDarkModeContext } from 'react-native-dynamic';
import { getColor, dynamicColor } from 'theme/colors';
import { AccountIcon, SearchIcon, UploadIcon } from './icons';

const COLORS = {
  search: [dynamicColor.searchBackground, dynamicColor.searchText],
  upload: [dynamicColor.uploadBackground, dynamicColor.uploadText],
  profile: [dynamicColor.profileBackground, dynamicColor.profileText],
};
const ICONS = {
  search: SearchIcon,
  upload: UploadIcon,
  profile: AccountIcon,
};

export const tabBar = props => <TabBar {...props} />;

export function TabBar({ state, descriptors, navigation }) {
  const mode = useDarkModeContext();
  const s = ds[mode];
  const color = getColor(mode);

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

        const [backgroundColor, textColor] = COLORS[routeName].map(c => c[mode]);
        const Icon = ICONS[routeName];

        return (
          <TouchableOpacity key={route.name} onPress={onPress} style={s.tab}>
            <View style={[s.tabRound, { backgroundColor: isFocused ? backgroundColor : null }]}>
              <Icon size={25} color={isFocused ? textColor : color.tabText} fill={isFocused} />
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

const ds = new DynamicStyleSheet({
  container: {
    flexDirection: 'row',
    backgroundColor: dynamicColor.tabsBackground,
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
});
