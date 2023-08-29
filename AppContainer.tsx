import React, { useEffect } from "react";
import Orientation from "react-native-orientation-locker";
import { isTablet } from "./hook/isTablet";
import App from "./App";
import { Provider } from "react-redux";
import store from "./redux";

const AppContainer = () => {
  useEffect(() => {
    if (isTablet()) {
      Orientation.lockToLandscape();
    } else {
      Orientation.lockToPortrait();
    }
  }, []);

  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
};

export default AppContainer;
