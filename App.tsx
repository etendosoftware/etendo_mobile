import React, { useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { LoadingScreen } from './src/components';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { defaultTheme } from './src/themes';

import HomeStack from './src/navigation/HomeStack';
import LoginStack from './src/navigation/LoginStack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAppDispatch, useAppSelector } from './redux';
import { selectData, selectToken, selectUser } from './redux/user';
import { useUser } from './hook/useUser';
import { languageDefault } from './src/helpers/getLanguajes';
import { selectLoadingScreen, setLoadingScreen } from './redux/window';
import { Camera } from 'react-native-vision-camera';
import { deviceOrientation } from './src/utils';
import { Alert } from 'etendo-ui-library';
import ReceiveSharingIntent from 'react-native-receive-sharing-intent';
import { References } from './src/constants/References';

interface Props {}
type RootStackParamList = {
  HomeStack: any;
  LoginStack: any;
  LoadingScreen: any;
};
const Stack = createNativeStackNavigator<RootStackParamList>();

const App: React.FC<Props> = () => {
  const { atAppInit, getImageProfile } = useUser();
  const dispatch = useAppDispatch();
  const token = useAppSelector(selectToken);
  const user = useAppSelector(selectUser);
  const data = useAppSelector(selectData);
  const loadingScreen = useAppSelector(selectLoadingScreen);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        deviceOrientation();
        if (user) {
          await getImageProfile(data);
        }
        await languageDefault();
        dispatch(setLoadingScreen(false));
        await atAppInit();
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    };

    const checkPermission = async () => {
      try {
        await Camera.requestCameraPermission();
      } catch (error) {
        console.error('Error checking camera permissions:', error);
      }
    };

    const handleSharedFiles = () => {
      try {
        ReceiveSharingIntent.getReceivedFiles(
          (sharedFiles: any) => {
            console.log('Shared files received:', sharedFiles);
          },
          (error: any) => {
            console.error('Error receiving shared files:', error);
          },
          References.EtendoReceiveShare,
        );
      } catch (error) {
        console.error('Error handling shared files:', error);
      }
    };

    fetchInitialData();
    checkPermission();
    handleSharedFiles();

    return () => {
      ReceiveSharingIntent.clearReceivedFiles();
    };
  }, []);

  return (
    <PaperProvider theme={defaultTheme}>
      <NavigationContainer>
        <Stack.Navigator>
          {loadingScreen ? (
            <Stack.Screen
              name="LoadingScreen"
              component={LoadingScreen}
              options={{ headerShown: false }}
            />
          ) : token ? (
            <Stack.Screen
              name="HomeStack"
              component={HomeStack}
              options={{ headerShown: false }}
            />
          ) : (
            <Stack.Screen
              name="LoginStack"
              component={LoginStack}
              options={{ headerShown: false }}
            />
          )}
        </Stack.Navigator>
      </NavigationContainer>
      <Alert />
    </PaperProvider>
  );
};

export default App;
