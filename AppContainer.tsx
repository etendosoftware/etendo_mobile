import React, { useEffect, useMemo, useState } from "react";
import Orientation from "react-native-orientation-locker";
import { isTablet } from "./hook/isTablet";
import App from "./App";
import { Provider } from "react-redux";
import store from "./redux";
import { ILanguage } from "./src/interfaces";
import { languageDefault } from "./src/helpers/getLanguajes";

const AppContainer = () => {
  const [languages, setLanguages] = useState<ILanguage[]>([]);
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

  const value = useMemo(
    () => ({
      languages,
      setToken,
      token
    }),
    [languages, setToken, token]
  );

  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
};

export default AppContainer;
