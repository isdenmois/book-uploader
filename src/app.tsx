import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { UploadScreen } from './pages/upload/upload.screen';
import { ScanScreen } from 'pages/scan';
import { HomeScreen } from 'pages/home';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <UploadScreen>
        <Stack.Navigator>
          <Stack.Screen name='scan' component={ScanScreen} options={{ title: '' }} />
          <Stack.Screen name='home' component={HomeScreen} options={{ header: () => null }} />
        </Stack.Navigator>
      </UploadScreen>
    </NavigationContainer>
  );
};

export default App;
