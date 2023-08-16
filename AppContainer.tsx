import React, { useEffect, useMemo, useState } from "react";
import MainAppContext from "./src/contexts/MainAppContext";
import locale from "./src/i18n/locale";
import Windows from "./src/stores/Windows";
import User from "./src/stores/User";
import Languages from "./src/ob-api/objects/Languages";
import { supportedLocales } from "./src/i18n/config";
import Orientation from "react-native-orientation-locker";
import { isTablet } from "./hook/isTablet";
import App from "./App";
import { ContainerProvider } from "./src/contexts/ContainerContext";
import { Provider } from "react-redux";
import store, { useAppSelector } from "./redux";
import { Language } from "./src/interfaces";
import { languageDefault } from "./src/helpers/getLanguajes";
import { selectUser } from "./redux/user";

const AppContainer = () => {
  // const dispatch = useAppDispatch();
  // const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [token, setToken] = useState<boolean>(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      if (isTablet()) {
        Orientation.lockToLandscape();
      } else {
        Orientation.lockToPortrait();
      }

      await languageDefault();
    };
    fetchInitialData();
  }, []);

  // TO-DO: Delete this after implement the new language system
  // const changeLanguage = async (input: string) => {
  //   locale.setCurrentLanguage(input);
  //   if (User.user) {
  //     Windows.loading = true;
  //     User.saveLanguage(input);
  //     Windows.loading = false;
  //   }
  //   setSelectedLanguage(input);
  // };

  const value = useMemo(
    () => ({
      // changeLanguage,
      // selectedLanguage,
      languages,
      setToken,
      token
    }),
    [
      //changeLanguage,
      // selectedLanguage,
      languages,
      setToken,
      token
    ]
  );

  return (
    <Provider store={store}>
      <MainAppContext.Provider value={value}>
        <ContainerProvider>
          <App />
        </ContainerProvider>
      </MainAppContext.Provider>
    </Provider>
  );
};

export default AppContainer;
