import React, { useEffect, useState } from 'react';
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
import { References } from './src/constants/References';
import ReceiveSharingIntent from 'react-native-receive-sharing-intent';
import {setSharedFiles} from "./redux/shared-files-reducer";

interface Props { }
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
        // Important: Do not add any other code here, this is for the root component only.
        // Add code in the `atAppInit` function below if you need to run any code at app start/restart.
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
    const addFilePrefixIfNeeded = (path: string) => {
      return path.startsWith("file://") ? path : `file://${path}`;
    };

    const handleSharedFiles = () => {
      console.log("🪄 handleSharedFiles()");

      try {
        ReceiveSharingIntent.getReceivedFiles(
          (receivedFiles: any[]) => {
            console.log("🪄 ReceiveSharingIntent.getReceivedFiles", receivedFiles);
            console.log("🪄 Pre dispatch ", receivedFiles && receivedFiles.length > 0);
              const adjustedFiles = receivedFiles.map(file => ({
                filePath: addFilePrefixIfNeeded(file.filePath),
                // Extract file name from path
                fileName: file.filePath.split('/').pop() || '',
                fileMimeType: getMimeType(file.mimeType)
              }));
              console.log("🪄 adjustedFiles", adjustedFiles);
              dispatch(setSharedFiles([...adjustedFiles]));
          },
          (error: any) => {
            console.error("🪄 ReceiveSharingIntent.getReceivedFiles error", error);
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

  const getMimeType = (mimeType: string) => {
    console.log("🪄 getMimeType -> mimeType", mimeType);
    switch (mimeType) {
      case '.jpg':
      case '.jpeg':
        return 'image/jpeg';
      case '.png':
        return 'image/png';
      case '.pdf':
        return 'application/pdf';
      default:
        return 'application/octet-stream';
    }
  }
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
              initialParams={{ token }}
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
