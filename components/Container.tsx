/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { useState, type PropsWithChildren } from 'react';
import {
  StyleSheet,
  Text,
  useColorScheme,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import HomePage from './HomePage';
import { useWindowDimensions } from 'react-native';

import { createDrawerNavigator } from '@react-navigation/drawer';

const Stack = createStackNavigator();

const Drawer = createDrawerNavigator();

const App = ({ appsData, url }: any) => {
  console.log(appsData)
  const isDarkMode = useColorScheme() === 'dark';

  const dimensions = useWindowDimensions();

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <NavigationContainer>
      <Drawer.Navigator
        screenOptions={{
          drawerType: dimensions.width >= 768 ? 'permanent' : 'front',
        }}
      >
        <Drawer.Screen name="Home" component={Home} />

        {appsData && appsData.map(app => {
          return (
            <Drawer.Screen name={app.etdappAppName} component={HomePage} initialParams={{ __id: app.path, url: url }} />
          )
        })}
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'blue', borderColor: 'blue', borderWidth: 1, padding: 10, marginBottom: 10
  },
  buttonText: {
    color: 'white'
  }
});

const Home = () => {
  return (<Text>Home</Text>)
}

export default App;
