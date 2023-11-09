import { AppRegistry, LogBox } from "react-native";
import AppContainer from "./AppContainer.tsx";
import { name as appName } from "./app.json";

LogBox.ignoreLogs([
  "Possible Unhandled Promise Rejection",
  '"transform" style array'
]);

AppRegistry.registerComponent(appName, () => AppContainer);
