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
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ContainerProvider } from './contexts/ContainerContext';
import MainScreen from './components/MainScreen';

const App = () => {
  return (
    <ContainerProvider>
      <SafeAreaProvider>
        <MainScreen />
      </SafeAreaProvider>
    </ContainerProvider>
  );
};

export default App;
