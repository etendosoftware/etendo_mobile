import * as AntDesign from 'react-native-vector-icons/AntDesign';
import * as AsyncStorage from '@react-native-async-storage/async-storage';
import * as Axios from 'axios';
import * as Base64 from 'base-64';
import * as BottomTabs from '@react-navigation/bottom-tabs';
import * as Color from 'color';
import * as Compat from '@react-navigation/compat';
import * as DateFns from 'date-fns';
import * as DatetimePicker from '@react-native-community/datetimepicker';
import * as Drawer from '@react-navigation/drawer';
import * as EtendoUiLibrary from 'etendo-ui-library';
import * as etrest from 'etrest';
import * as FontAwesome from 'react-native-vector-icons/FontAwesome';
import * as GestureHandler from 'react-native-gesture-handler';
import * as I18nJs from 'i18n-js';
import * as Ionicons from 'react-native-vector-icons/Ionicons';
import * as MaskedView from '@react-native-community/masked-view';
import * as MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as mobx from 'mobx';
import * as mobxPersist from 'mobx-persist';
import * as mobxReact from 'mobx-react';
import * as Picker from '@react-native-picker/picker';
import * as PropTypes from 'prop-types';
import * as React from 'react';
import * as ReactDom from 'react-dom';
import * as ReactNative from 'react-native';
import * as ReactNativeBlobUtil from 'react-native-blob-util';
import * as ReactNativeDatePicker from 'react-native-date-picker';
import * as ReactNativeLoadingSpinnerOverlay from 'react-native-loading-spinner-overlay';
import * as ReactNativeOrientationLocker from 'react-native-orientation-locker';
import * as ReactNativePaper from 'react-native-paper';
import * as ReactNativePdf from 'react-native-pdf';
import * as ReactNativePermissions from 'react-native-permissions';
import * as ReactNativeShare from 'react-native-share';
import * as ReactNativeSVG from 'react-native-svg';
import * as ReactNativeVisionCamera from 'react-native-vision-camera';
import * as RnMarkdownDisplay from 'react-native-markdown-display';
import * as ReactNavigationCore from '@react-navigation/core';
import * as ReactNavigationNative from '@react-navigation/native';
import * as ReactNavigationNativeStack from '@react-navigation/native-stack';
import * as ReactNavigationStack from '@react-navigation/stack';
import * as RnPlaceholder from 'rn-placeholder';
import * as SafeAreaContext from 'react-native-safe-area-context';
import * as Screens from 'react-native-screens';
import * as Sentry from '@sentry/react-native';
import * as SwipeableItem from 'react-native-swipeable-item';
import * as Swiper from 'react-native-swiper';
import * as TsLib from 'tslib';
import * as Unmock from 'unmock';
import * as VectorIcons from 'react-native-vector-icons';
import * as ReactNativeDocumentPicker from 'react-native-document-picker';
import { Etendo } from '../helpers/Etendo';

const Packages = {
  '@react-native-async-storage/async-storage': () => AsyncStorage,
  '@react-native-community/datetimepicker': () => DatetimePicker,
  '@react-native-community/masked-view': () => MaskedView,
  '@react-native-picker/picker': () => Picker,
  '@react-navigation/bottom-tabs': () => BottomTabs,
  '@react-navigation/compat': () => Compat,
  '@react-navigation/core': () => ReactNavigationCore,
  '@react-navigation/drawer': () => Drawer,
  '@react-navigation/native-stack': () => ReactNavigationNativeStack,
  '@react-navigation/native': () => ReactNavigationNative,
  '@react-navigation/stack': () => ReactNavigationStack,
  '@sentry/react-native': () => Sentry,
  'base-64': () => Base64,
  'date-fns': () => DateFns,
  'etendo-ui-library': () => EtendoUiLibrary,
  'i18n-js': () => I18nJs,
  'mobx-persist': () => mobxPersist,
  'mobx-react': () => mobxReact,
  'prop-types': () => PropTypes,
  'react-dom': () => ReactDom,
  'react-native-blob-util': () => ReactNativeBlobUtil,
  'react-native-date-picker': () => ReactNativeDatePicker,
  'react-native-gesture-handler': () => GestureHandler,
  'react-native-loading-spinner-overlay': () =>
    ReactNativeLoadingSpinnerOverlay,
  'react-native-orientation-locker': () => ReactNativeOrientationLocker,
  'react-native-paper': () => ReactNativePaper,
  'react-native-pdf': () => ReactNativePdf,
  'react-native-permissions': () => ReactNativePermissions,
  'react-native-safe-area-context': () => SafeAreaContext,
  'react-native-screens': () => Screens,
  'react-native-share': () => ReactNativeShare,
  'react-native-svg': () => ReactNativeSVG,
  'react-native-swipeable-item': () => SwipeableItem,
  'react-native-swiper': () => Swiper,
  'react-native-vector-icons': () => VectorIcons,
  'react-native-vector-icons/AntDesign': () => AntDesign,
  'react-native-vector-icons/FontAwesome': () => FontAwesome,
  'react-native-vector-icons/Ionicons': () => Ionicons,
  'react-native-vector-icons/MaterialCommunityIcons': () =>
    MaterialCommunityIcons,
  'react-native-vision-camera': () => ReactNativeVisionCamera,
  'react-native-markdown-display': () => RnMarkdownDisplay,
  'react-native-document-picker': () => ReactNativeDocumentPicker,
  'react-native': () => ReactNative,
  'rn-placeholder': () => RnPlaceholder,
  axios: () => Axios,
  color: () => Color,
  Etendo: () => Etendo,
  etrest: () => etrest,
  mobx: () => mobx,
  react: () => React,
  tslib: () => TsLib,
  unmock: () => Unmock,
};

const fromPairs = pairs =>
  Object.assign({}, ...pairs.map(([k, v]) => ({ [k]: v })));
const AllPackages = fromPairs(
  Object.keys(Packages).map(k => [k, () => ({ exports: Packages[k]() })]),
);

export default AllPackages;
