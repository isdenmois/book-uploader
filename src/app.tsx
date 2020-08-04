import React from 'react';
import { ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ScanScreen } from 'pages/scan';
import { HomeScreen } from 'pages/home';
import { AddressContext, useCreateAddressContext } from 'utils/address';

const Stack = createStackNavigator();

const App = () => {
  const context = useCreateAddressContext();

  if (context.address === null) {
    return <ActivityIndicator size='large' />;
  }

  return (
    <AddressContext.Provider value={context}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={context.address ? 'home' : 'scan'}>
          <Stack.Screen name='scan' component={ScanScreen} options={{ title: '' }} />
          <Stack.Screen name='home' component={HomeScreen} options={{ header: () => null }} />
        </Stack.Navigator>
      </NavigationContainer>
    </AddressContext.Provider>
  );
};

export default App;
