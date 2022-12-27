import { AppRegistry } from "react-native";
import { decode } from "base-64";
import * as Sentry from "@sentry/react-native";
import App from "./App";

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

// Sentry.init({
//   dsn:
//     "https://e89769bc69164ad19c89bceac42ecfc8@o391053.ingest.sentry.io/5661649"
// });

AppRegistry.registerComponent(appName, () => App);
