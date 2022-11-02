/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { useContext } from 'react';
import {
  Button,
  StyleSheet,
  Text
} from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

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

  return (
    <NavigationContainer>
      <Drawer.Navigator
        screenOptions={{
          drawerType: dimensions.width >= 768 ? 'permanent' : 'front',
        }}
      >
        <Drawer.Screen name="Home" component={StackedHome} />
        {menuItems && menuItems.map((menuItem: any) => {
          const params = { ...menuItem }
          if (params.component) {
            delete params.component
          }
          return (
            <Drawer.Screen name={menuItem.name} component={menuItem.component ? menuItem.component : HomePage}
              initialParams={params}
              options={{}}
            />
          )
        })}
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

const StackedHome = () => {
  return (
    <Stack.Navigator >
      <Stack.Screen name="Screen 1" component={Home} options={{ headerShown: false }} />
      <Stack.Screen name="Screen 2" component={Home2} options={{ headerShown: false }} />
    </Stack.Navigator>
  )
}

const Home = (props: any) => {
  const navigation = useNavigation();

  return (
    <>
      <Text>{"Home Screen 1"}</Text>
      <Button title='Next' onPress={() => {
        navigation.navigate('Screen 2')
      }} />
    </>
  )
}

const Home2 = () => {
  const navigation = useNavigation();

  return (
    <>
      <Text>{"Home Screen 2"}</Text>
      <Button title='Previous' onPress={() => {
        navigation.navigate('Screen 1')
      }} />
    </>
  )
}
export default App;
