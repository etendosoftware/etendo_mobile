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
import { Button, Text, Dimensions, PixelRatio } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomePage from './HomePage';
import {useWindowDimensions} from 'react-native';

import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { ContainerContext } from '../contexts/ContainerContext';
import { Etendo } from '../helpers/Etendo';

const Stack = createStackNavigator();

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;

const Drawer = createDrawerNavigator();
export const DEV_URL = 'http://10.0.2.2:3000';

const App = ({}: any) => {
  const dimensions = useWindowDimensions();
  const context = useContext(ContainerContext);

  const isTablet = () => {
    let pixelDensity = PixelRatio.get();
    const adjustedWidth = width * pixelDensity;
    const adjustedHeight = height * pixelDensity;
    if (pixelDensity < 2 && (adjustedWidth >= 1000 || adjustedHeight >= 1000)) {
      return true;
    } else
      return (
        pixelDensity === 2 && (adjustedWidth >= 1920 || adjustedHeight >= 1920)
      );
  };

  return (
    <NavigationContainer>
      <Drawer.Navigator
        drawerContent={props => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerShown: false,
        }}>
        <Drawer.Screen name="Home" component={StackedHome} />
        {context?.state?.menuItems.map((menuItem: any) => {
          const params = {...menuItem};
          if (params.component) {
            delete params.component;
          }
          return (
            <Drawer.Screen
              name={menuItem.name}
              component={menuItem.component ? menuItem.component : HomePage}
              initialParams={params}
              options={{}}
            />
          );
        })}
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

const CustomDrawerContent = (props) => {
  Etendo.globalNav = props.navigation;
  return (
    <DrawerContentScrollView {...props}>
        {props.state.routes.map(route => {
          let style = {}
          if (route.params && route.params.app) {
            style = {
              marginLeft: 40,
            };
          }
          return (
            <DrawerItem
              label={route.name}
              labelStyle={{}}
              style={style}
              onPress={() => {
                if (route.params && route.params.app) {
                  Etendo.navigation[route.params.app].navigate(
                    route.params.app,
                    route.params,
                  );
                  Etendo.toggleDrawer();
                } else {
                  props.navigation.navigate(route.name, route.params);
                }
              }}
            />
          );
        })}
    </DrawerContentScrollView>
  );
}

const StackedHome = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Screen 1"
        component={Home}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Screen 2"
        component={Home2}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

const Home = (props: any) => {
  const navigation = useNavigation();

  return (
    <>
      <Text>{'Home Screen 1'}</Text>
      <Button
        title="Next"
        onPress={() => {
          navigation.navigate('Screen 2');
        }}
      />
    </>
  );
};

const Home2 = () => {
  const navigation = useNavigation();

  return (
    <>
      <Text>{'Home Screen 2'}</Text>
      <Button
        title="Previous"
        onPress={() => {
          navigation.navigate('Screen 1');
        }}
      />
    </>
  );
};
export default App;
