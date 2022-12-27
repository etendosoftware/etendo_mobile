import { AppRegistry } from "react-native";
import { decode } from "base-64";
import * as Sentry from "@sentry/react-native";
import App from "./App";

// Polyfill atob which is used in OBRest library. Remove if library is updated to not use atob() anymore.
if (!global.atob) {
  global.atob = decode;
}

// Sentry.init({
//   dsn:
//     "https://e89769bc69164ad19c89bceac42ecfc8@o391053.ingest.sentry.io/5661649"
// });

AppRegistry.registerComponent("main", () => App);
