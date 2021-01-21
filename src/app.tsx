import React, { useEffect } from 'react';
import { RecoilRoot } from 'recoil';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ColorSchemeProvider, DynamicStyleSheet, useDarkModeContext } from 'react-native-dynamic';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import { ScanScreen } from 'screens/scan';
import { MainScreen } from 'screens/main';
import { dynamicColor } from 'theme/colors';
import { StatusBar, StatusBarStyle } from 'react-native';

const Stack = createStackNavigator();

const header = () => null;

const App = () => {
  return (
    <RecoilRoot>
      <ColorSchemeProvider>
        <NavigationContainer>
          <StackNavigator />
        </NavigationContainer>
      </ColorSchemeProvider>
    </RecoilRoot>
  );
};

function StackNavigator() {
  const mode = useDarkModeContext();
  const s = ds[mode];
  const barStyle: StatusBarStyle = mode === 'dark' ? 'light-content' : 'dark-content';

  useEffect(() => {
    changeNavigationBarColor(dynamicColor.tabsBackground[mode], mode === 'light', false);
  }, [mode]);

  return (
    <>
      <StatusBar backgroundColor={s.cardStyle.backgroundColor} barStyle={barStyle} />
      <Stack.Navigator screenOptions={{ cardStyle: s.cardStyle }}>
        <Stack.Screen name='main' component={MainScreen} options={{ header }} />
        <Stack.Screen
          name='scan'
          component={ScanScreen}
          options={{
            title: '',
            animationEnabled: false,
            header,
            cardStyle: s.modalCardStyle,
            cardOverlayEnabled: false,
          }}
        />
      </Stack.Navigator>
    </>
  );
}

const ds = new DynamicStyleSheet({
  cardStyle: {
    backgroundColor: dynamicColor.background,
  },
  modalCardStyle: {
    backgroundColor: 'transparent',
  },
});

export default App;
