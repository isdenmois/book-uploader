import React from 'react';
import { RecoilRoot } from 'recoil';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ViewStyle } from 'react-native';
import { ScanScreen } from 'screens/scan';
import { MainScreen } from 'screens/main';
import * as colors from 'theme/colors';

const Stack = createStackNavigator();

const header = () => null;

const App = () => {
  return (
    <RecoilRoot>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ cardStyle: { backgroundColor: colors.Background } }}>
          <Stack.Screen name='main' component={MainScreen} options={{ header }} />
          <Stack.Screen
            name='scan'
            component={ScanScreen}
            options={{
              title: '',
              animationEnabled: false,
              header,
              cardStyle: modalCardStyle,
              cardOverlayEnabled: false,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </RecoilRoot>
  );
};

const modalCardStyle = {
  backgroundColor: 'transparent',
} as ViewStyle;

export default App;
