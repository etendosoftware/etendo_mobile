import React, { useEffect } from "react";
import App from "./App";
import { Provider } from "react-redux";
import store from "./redux/store";
import { deviceOrientation } from "./src/utils";
import { SafeAreaProvider } from "react-native-safe-area-context";

const AppContainer = () => {
  useEffect(() => {
    deviceOrientation();
  }, []);

  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <App />
      </Provider>
    </SafeAreaProvider>
  );
};

export default AppContainer;
