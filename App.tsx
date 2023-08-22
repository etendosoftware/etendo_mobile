import React, { useEffect } from "react";
import { LoadingScreen } from "./src/components";
import { Provider as PaperProvider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { defaultTheme } from "./src/themes";

import Orientation from "react-native-orientation-locker";
import { isTablet } from "./hook/isTablet";
import HomeStack from "./src/navigation/HomeStack";
import LoginStack from "./src/navigation/LoginStack";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Toast from "react-native-toast-message";
import { useAppDispatch, useAppSelector } from "./redux";
import { selectData, selectToken, selectUser } from "./redux/user";
import { useUser } from "./hook/useUser";
import { getLanguages } from "./src/helpers/getLanguajes";
import { selectLoadingScreen, setLoadingScreen } from "./redux/window";
import { Camera } from "react-native-vision-camera";

interface Props {}
type RootStackParamList = {
  HomeStack: any;
  LoginStack: any;
  LoadingScreen: any;
};
const Stack = createNativeStackNavigator<RootStackParamList>();

const App: React.FC<Props> = () => {
  const { atAppInit, setUrlGlobal, getImageProfile } = useUser();
  const dispatch = useAppDispatch();
  const tokenRedux = useAppSelector(selectToken);
  const userRedux = useAppSelector(selectUser);
  const data = useAppSelector(selectData);
  const loadingScreen = useAppSelector(selectLoadingScreen);

  useEffect(() => {
    const fetchInitialData = async () => {
      if (isTablet()) {
        Orientation.lockToLandscape();
      } else {
        Orientation.lockToPortrait();
      }
      await setUrlGlobal();
      if (userRedux) {
        await getImageProfile(data);
      }
      dispatch(setLoadingScreen(false));
      await atAppInit(userRedux, await getLanguages());
    };

    fetchInitialData();
    checkPermission();
  }, []);

  const checkPermission = async () => {
    await Camera.requestCameraPermission();
  };

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
          ) : tokenRedux ? (
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
      <Toast />
    </PaperProvider>
  );
};

export default App;
