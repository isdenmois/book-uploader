import React from 'react';
import { RecoilRoot } from 'recoil';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ScanScreen } from 'screens/scan';
import { MainScreen } from 'screens/main';
import * as colors from 'theme/colors';

const Stack = createStackNavigator();

const App = () => {
  return (
    <RecoilRoot>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ cardStyle: { backgroundColor: colors.Background } }}>
          <Stack.Screen name='main' component={MainScreen} options={{ header: () => null }} />
          <Stack.Screen name='scan' component={ScanScreen} options={{ title: '' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </RecoilRoot>
  );
};

export default App;
