/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { useReducer, useState } from 'react';
import {
  StyleSheet,
  Text,
  useColorScheme,
} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { createDrawerNavigator } from '@react-navigation/drawer';
import { Login } from './components/Login';
import Container from './components/Container';
import { ContainerContext, ContainerProvider } from './contexts/ContainerContext';
import MainScreen from './components/MainScreen';


const App = () => {
  /*
  const [appsData, setAppsData] = useState([])
  const [menuItems, setMenuItems] = useState([])
  const [url, setUrl] = useState("http://10.0.2.2:8080/etendo")
  const [testUrl, setTestUrl] = useState("http://10.0.2.2:3000/")
  const [logged, setLogged] = useState(false)
  */

  const navigation = () => {
    console.log("call")
  }
  return (
    <ContainerProvider>
      <SafeAreaProvider>
        <MainScreen />
      </SafeAreaProvider>
    </ContainerProvider>
  );
};

export default App;
