import React, { useEffect } from "react";
import App from "./App";
import { Provider } from "react-redux";
import store from "./redux";
import { deviceOrientation } from "./src/utils";

const AppContainer = () => {
  useEffect(() => {
    deviceOrientation();
  }, []);

  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
};

export default AppContainer;
