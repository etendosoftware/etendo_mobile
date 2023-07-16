import React, { useContext, useEffect, useState } from "react";
import { User } from "./src/stores";
import { LoadingScreen } from "./src/components";
import { Provider as PaperProvider } from "react-native-paper";
import MainAppContext from "./src/contexts/MainAppContext";
import { NavigationContainer } from "@react-navigation/native";
import { defaultTheme } from "./src/themes";

import Orientation from "react-native-orientation-locker";
import { isTablet } from "./hook/isTablet";
import { ContainerContext } from "./src/contexts/ContainerContext";
import loadDynamic from "./src/helpers/loadDynamic";
import { OBRest, Restrictions } from "etrest";
import { setUrl } from "./src/ob-api/ob";
import HomeStack from "./src/navigation/HomeStack";
import LoginStack from "./src/navigation/LoginStack";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import getImageProfile from "./src/helpers/getImageProfile";
import locale from "./src/i18n/locale";

interface Props {}
type RootStackParamList = {
  HomeStack: any;
  LoginStack: any;
  LoadingScreen: any;
};
const Stack = createNativeStackNavigator<RootStackParamList>();

const App: React.FC<Props> = () => {
  const [isLoading, setIsLoading] = useState(true);

  const { setToken, token } = useContext(MainAppContext);
  const { dispatch } = useContext(ContainerContext);

  useEffect(() => {
    const fetchInitialData = async () => {
      if (isTablet()) {
        Orientation.lockToLandscape();
      } else {
        Orientation.lockToPortrait();
      }
      await setUrl();
      await User.loadToken();

      if (User.token) {
        await User.reloadUserData(User.token);
        await getImageProfile(dispatch);
        setToken(true);
        setIsLoading(false);
        await loadDynamic(dispatch);
      } else {
        setToken(false);
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  return (
    <PaperProvider theme={defaultTheme}>
      <NavigationContainer>
        <Stack.Navigator>
          {isLoading ? (
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
    </PaperProvider>
  );
};

export default App;
