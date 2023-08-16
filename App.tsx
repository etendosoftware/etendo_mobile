import React, { useContext, useEffect } from "react";
import { LoadingScreen } from "./src/components";
import { Provider as PaperProvider } from "react-native-paper";
import MainAppContext from "./src/contexts/MainAppContext";
import { NavigationContainer } from "@react-navigation/native";
import { defaultTheme } from "./src/themes";

import Orientation from "react-native-orientation-locker";
import { isTablet } from "./hook/isTablet";
import { ContainerContext } from "./src/contexts/ContainerContext";
import loadDynamic from "./src/helpers/loadDynamic";
import { getUrl, setUrl } from "./src/ob-api/ob";
import HomeStack from "./src/navigation/HomeStack";
import LoginStack from "./src/navigation/LoginStack";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import getImageProfile from "./src/helpers/getImageProfile";
import { SET_LOADING_SCREEN, SET_URL } from "./src/contexts/actionsTypes";
import Toast from "react-native-toast-message";
import { useAppSelector } from "./redux";
import { selectData, selectToken, selectUser } from "./redux/user";
import { useUser } from "./hook/useUser";

interface Props {}
type RootStackParamList = {
  HomeStack: any;
  LoginStack: any;
  LoadingScreen: any;
};
const Stack = createNativeStackNavigator<RootStackParamList>();

const App: React.FC<Props> = () => {
  const { setToken, token } = useContext(MainAppContext);
  const { dispatch, state } = useContext(ContainerContext);
  const { reloadUserData } = useUser();

  const tokenRedux = useAppSelector(selectToken);
  const userRedux = useAppSelector(selectUser);
  const data = useAppSelector(selectData);

  useEffect(() => {
    const fetchInitialData = async () => {
      if (isTablet()) {
        Orientation.lockToLandscape();
      } else {
        Orientation.lockToPortrait();
      }
      await setUrl();
      const url = await getUrl();
      dispatch({ type: SET_URL, url: url });

      if (userRedux) {
        await reloadUserData(userRedux);
        await getImageProfile(dispatch, data);
        setToken(true);
        dispatch({ type: SET_LOADING_SCREEN, loadingScreen: false });
        await loadDynamic(dispatch, tokenRedux);
      } else {
        setToken(false);
        dispatch({ type: SET_LOADING_SCREEN, loadingScreen: false });
      }
    };

    fetchInitialData();
  }, []);

  return (
    <PaperProvider theme={defaultTheme}>
      <NavigationContainer>
        <Stack.Navigator>
          {state.loadingScreen ? (
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
      <Toast />
    </PaperProvider>
  );
};

export default App;
