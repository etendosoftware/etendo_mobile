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
import DynamicComponent from './components/DynamicComponent';
import HomePage from './components/HomePage';
import { useWindowDimensions } from 'react-native';

import { createDrawerNavigator } from '@react-navigation/drawer';
import { Login } from './components/Login';
import Container from './components/Container';

const Stack = createStackNavigator();

const Drawer = createDrawerNavigator();

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const dimensions = useWindowDimensions();

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const [appsData, setAppsData] = useState([])
  const [url, setUrl] = useState("http://10.0.2.2:8080/etendo")
  const [logged, setLogged] = useState(false)
  return (
    <SafeAreaProvider>
      {!logged && <Login setAppsData={setAppsData} setLogged={setLogged} setUrl={setUrl} url={url} />}
      {logged && <Container url={url} appsData={appsData} setLogged={setLogged} />}
    </SafeAreaProvider>
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
