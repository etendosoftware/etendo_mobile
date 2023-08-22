import React, { useEffect } from "react";
import Orientation from "react-native-orientation-locker";
import { isTablet } from "./hook/isTablet";
import App from "./App";
import { Provider } from "react-redux";
import store from "./redux";
import { languageDefault } from "./src/helpers/getLanguajes";

const AppContainer = () => {
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

  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
};

export default AppContainer;
