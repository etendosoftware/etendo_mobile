import React, { useEffect, useState } from 'react';
import { LoadingScreen } from './src/components';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { defaultTheme } from './src/themes';

import locale from './src/i18n/locale';
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
import { Alert, show } from 'etendo-ui-library';
import { References } from './src/constants/References';
import ReceiveSharingIntent from 'react-native-receive-sharing-intent';

interface Props { }
type RootStackParamList = {
  HomeStack: any;
  LoginStack: any;
  LoadingScreen: any;
};
const Stack = createNativeStackNavigator<RootStackParamList>();

const App: React.FC<Props> = () => {
  const [sharedFiles, setSharedFiles] = useState(null)
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
        console.error(locale.t('ErrorFetchingInitialData'), error);
      }
    };

    const checkPermission = async () => {
      try {
        await Camera.requestCameraPermission();
      } catch (error) {
        show(locale.t('ErrorCheckingCameraPermissions'), 'error');
        console.error(locale.t('ErrorCheckingCameraPermissions'), error);
      }
    };

    const handleSharedFiles = () => {
      try {
        ReceiveSharingIntent.getReceivedFiles(
          (sharedFiles: any) => {
            setSharedFiles(sharedFiles);
          },
          (error: any) => {
            console.error(locale.t('ErrorReceivingSharedFiles'), error);
          },
          References.EtendoReceiveShare,
        );
      } catch (error) {
        console.error(locale.t('ErrorHandlingSharedFiles'), error);
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
              initialParams={{ token, sharedFiles }}
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
