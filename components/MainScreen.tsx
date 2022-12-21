import React, {useContext} from 'react';
import {ContainerContext} from '../contexts/ContainerContext';
import Container from './Container';
import {Login} from './Login';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {LoginSettings} from './LoginSettings';

const Stack = createNativeStackNavigator();

const MainScreen = () => {
  const {
    state: {logged},
  } = useContext(ContainerContext);
  return (
    <>
      {!logged && (
        <NavigationContainer>
          <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="Login" key="login" component={Login} />
            <Stack.Screen
              name="LoginSettings"
              key="loginsettings"
              component={LoginSettings}
            />
          </Stack.Navigator>
        </NavigationContainer>
      )}
      {logged && <Container key="container" />}
    </>
  );
};
// <Login key="login" />}
export default MainScreen;
