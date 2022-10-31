/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { useContext, useState, type PropsWithChildren } from 'react';
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
import { ContainerContext } from '../contexts/ContainerContext';
import { Etendo } from '../helpers/Etendo';

const Stack = createStackNavigator();

const Drawer = createDrawerNavigator();
export const DEV_URL = "http://10.0.2.2:3000"

const App = ({ }: any) => {
  const dimensions = useWindowDimensions();
  const { state: { menuItems } } = useContext(ContainerContext);
  const Screen = (props) => {
    console.log("Screen props", props)
    return Etendo.render(props.component)
  }
  return (
    <NavigationContainer>
      <Drawer.Navigator
        screenOptions={{
          drawerType: dimensions.width >= 768 ? 'permanent' : 'front',
        }}
      >
        <Drawer.Screen name="Home" component={Home} />
        {menuItems && menuItems.map((menuItem: any) => {
          const mi = { ...menuItem }
          delete mi.component;
          return (
            <Drawer.Screen name={menuItem.name} component={menuItem.component ? (props: any) => { return (<Screen component={menuItem.component} />) } : HomePage}
              initialParams={mi}
              options={{}}
            />
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
