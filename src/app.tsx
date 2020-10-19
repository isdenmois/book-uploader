import React from 'react';
import { ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ScanScreen } from 'screens/scan';
import { MainScreen } from 'screens/main';
import { AddressContext, useCreateAddressContext } from 'services/address';
import * as colors from 'theme/colors';

const Stack = createStackNavigator();

const App = () => {
  const context = useCreateAddressContext();

  if (context.address === null) {
    return <ActivityIndicator size='large' />;
  }

  return (
    <AddressContext.Provider value={context}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName='main' screenOptions={{ cardStyle: { backgroundColor: colors.Background } }}>
          <Stack.Screen name='main' component={MainScreen} options={{ header: () => null }} />
          <Stack.Screen name='scan' component={ScanScreen} options={{ title: '' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </AddressContext.Provider>
  );
};

export default App;
