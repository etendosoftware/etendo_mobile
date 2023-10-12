import * as React from "react";
import * as ReactNative from "react-native";
import * as ReactNavigationNative from "@react-navigation/native";
import * as ReactNavigationNativeStack from "@react-navigation/native-stack";
import * as ReactNavigationStack from "@react-navigation/stack";
import * as mobx from "mobx";
import * as mobxPersist from "mobx-persist";
import * as mobxReact from "mobx-react";
import * as etrest from "etrest";
import * as ReactNativeLoadingSpinnerOverlay from "react-native-loading-spinner-overlay";
import * as ReactNativePaper from "react-native-paper";
import * as I18nJs from "i18n-js";
import * as DateFns from "date-fns";
import * as PropTypes from "prop-types";
import * as RnPlaceholder from "rn-placeholder";
import * as AsyncStorage from "@react-native-async-storage/async-storage";
import * as DatetimePicker from "@react-native-community/datetimepicker";
import * as MaskedView from "@react-native-community/masked-view";
import * as Picker from "@react-native-picker/picker";
import * as BottomTabs from "@react-navigation/bottom-tabs";
import * as Compat from "@react-navigation/compat";
import * as Drawer from "@react-navigation/drawer";
import * as ReactNavigationCore from "@react-navigation/core";
import * as ReactNativePermissions from "react-native-permissions";
import * as VisionCameraCodeScanner from "vision-camera-code-scanner";
import * as Sentry from "@sentry/react-native";
import * as ReactNativeVisionCamera from "react-native-vision-camera";
import * as ReactNativeOrientationLocker from "react-native-orientation-locker";
import * as Axios from "axios";
import * as Base64 from "base-64";
import * as GestureHandler from "react-native-gesture-handler";
import * as SafeAreaContext from "react-native-safe-area-context";
import * as Screens from "react-native-screens";
import * as SwipeableItem from "react-native-swipeable-item";
import * as Swiper from "react-native-swiper";
import * as TsLib from "tslib";
import * as Unmock from "unmock";
import * as ReactDom from "react-dom";
import * as VectorIcons from "react-native-vector-icons";
import * as Color from "color";
import * as Ionicons from "react-native-vector-icons/Ionicons";
import * as FontAwesome from "react-native-vector-icons/FontAwesome";
import * as AntDesign from "react-native-vector-icons/AntDesign";
import * as MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import * as ReactNativeDatePicker from "react-native-date-picker";
import * as EtendoUiLibrary from "etendo-ui-library";
import { Etendo } from "../helpers/Etendo";

const Packages = {
  react: () => React,
  "react-native": () => ReactNative,
  "@react-navigation/native": () => ReactNavigationNative,
  "@react-navigation/native-stack": () => ReactNavigationNativeStack,
  "@react-navigation/stack": () => ReactNavigationStack,
  "@react-native-async-storage/async-storage": () => AsyncStorage,
  "react-native-loading-spinner-overlay": () =>
    ReactNativeLoadingSpinnerOverlay,
  "react-native-paper": () => ReactNativePaper,
  mobx: () => mobx,
  "mobx-persist": () => mobxPersist,
  "mobx-react": () => mobxReact,
  "i18n-js": () => I18nJs,
  "date-fns": () => DateFns,
  "prop-types": () => PropTypes,
  "rn-placeholder": () => RnPlaceholder,
  "react-native-date-picker": () => ReactNativeDatePicker,
  "@react-native-community/datetimepicker": () => DatetimePicker,
  "@react-native-community/masked-view": () => MaskedView,
  "@react-native-picker/picker": () => Picker,
  "@react-navigation/bottom-tabs": () => BottomTabs,
  "@react-navigation/compat": () => Compat,
  "@react-navigation/drawer": () => Drawer,
  "@react-navigation/core": () => ReactNavigationCore,
  "react-native-permissions": () => ReactNativePermissions,
  "react-native-vision-camera": () => ReactNativeVisionCamera,
  "react-native-orientation-locker": () => ReactNativeOrientationLocker,
  "vision-camera-code-scanner": () => VisionCameraCodeScanner,
  "etendo-ui-library": () => EtendoUiLibrary,
  "@sentry/react-native": () => Sentry,
  color: () => Color,
  axios: () => Axios,
  "base-64": () => Base64,
  "react-dom": () => ReactDom,
  "react-native-gesture-handler": () => GestureHandler,
  "react-native-safe-area-context": () => SafeAreaContext,
  "react-native-screens": () => Screens,
  "react-native-swipeable-item": () => SwipeableItem,
  "react-native-swiper": () => Swiper,
  "react-native-vector-icons": () => VectorIcons,
  tslib: () => TsLib,
  unmock: () => Unmock,
  "react-native-vector-icons/Ionicons": () => Ionicons,
  "react-native-vector-icons/FontAwesome": () => FontAwesome,
  "react-native-vector-icons/AntDesign": () => AntDesign,
  "react-native-vector-icons/MaterialCommunityIcons": () =>
    MaterialCommunityIcons,
  etrest: () => etrest,
  Etendo: () => Etendo
};

const fromPairs = (pairs) =>
  Object.assign({}, ...pairs.map(([k, v]) => ({ [k]: v })));
const AllPackages = fromPairs(
  Object.keys(Packages).map((k) => [k, () => ({ exports: Packages[k]() })])
);

export default AllPackages;
