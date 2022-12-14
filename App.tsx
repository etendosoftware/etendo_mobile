/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {ContainerProvider} from './contexts/ContainerProvider';
import MainScreen from './components/MainScreen';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import {LoginSettings} from './components/LoginSettings';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <ContainerProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="MainScreen">
            <Stack.Screen
              name="MainScreen"
              component={MainScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="LoginSettings"
              component={LoginSettings}
              options={{headerShown: false}}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </ContainerProvider>
  );
};

export default App;
