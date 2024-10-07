import packages from '../components/packages';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { isTablet } from '../../hook/isTablet';
import Orientation from 'react-native-orientation-locker';
import { storeKey } from './KeyStorage';
import NetInfo from '@react-native-community/netinfo';
import { References } from '../constants/References';
import {
  show,
  setAlertDefaultDuration,
} from 'etendo-ui-library/dist-native/components/alert/AlertManager';
import locale from '../i18n/locale';

function getParsedModule(code: any, moduleName: any, packages: any) {
  try {
    const _this = Object.create(packages);
    function require(name) {
      try {
        if (!(name in _this) && moduleName === name) {
          let module = { exports: {} };
          _this[name] = () => module;
          let wrapper = Function('require, exports, module', code);
          wrapper(require, module.exports, module);
        } else if (!(name in _this)) {
          console.error(`Module '${name}' not found`);
          throw `Module '${name}' not found`;
        }
        return _this[name]().exports;
      } catch (error) {
        console.error(error);
        throw error;
      }
    }
    return require(moduleName);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function fetchComponent(id: any, url: any, navigation: any) {
  setAlertDefaultDuration(7000);
  const fullUrl = `${url}/${id}`;
  const dateLastDownBundleKey = `dateLastDownBundle-${id}`;

  // Verify internet connection
  async function isConnected() {
    try {
      const response = await fetch(fullUrl);
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  // Clear cache
  async function clearCache() {
    await AsyncStorage.removeItem(id);
    await AsyncStorage.removeItem(dateLastDownBundleKey);
  }

  // Fetch and store component
  async function downloadAndStoreComponent() {
    try {
      await clearCache();

      const response = await fetch(fullUrl);
      if (!response.ok) throw new Error('Network response was not ok');

      const data = await response.text();
      if (!data || data.trim() === '') throw new Error('Received empty or invalid code from the server');

      await AsyncStorage.setItem(id, data);
      const date = response.headers.get('date');
      await AsyncStorage.setItem(dateLastDownBundleKey, date || '');
      storeKey(dateLastDownBundleKey);

      return { default: getParsedModule(data, id, packages) };
    } catch (error) {
      console.error('Failed to download and store component:', error);
      throw error;
    }
  }

  // Load cached component
  async function loadCachedComponent() {
    const existingCode = await AsyncStorage.getItem(id);
    if (existingCode && existingCode.trim() !== '') {
      try {
        return { default: getParsedModule(existingCode, id, packages) };
      } catch (error) {
        console.warn('Failed to load cached component. Downloading a new version...', error);
      }
    }
    return null;
  }

  // Main logic
  try {
    const connection = await isConnected();
    if (!connection) {
      return {
        default: () => {
          navigation.navigate('Home');
          show(locale.t('LoginScreen:NetworkError'), 'error');
        },
      };
    }

    const responseChange = await fetch(fullUrl, { method: 'HEAD' });
    const lastModifiedNew = responseChange.headers.get('last-modified');

    const dateLastDownBundle = await AsyncStorage.getItem(dateLastDownBundleKey);

    if (!lastModifiedNew || !dateLastDownBundle || dateLastDownBundle < lastModifiedNew) {
      return (await downloadAndStoreComponent()).default;
    }

    const cachedComponent = await loadCachedComponent();
    return cachedComponent ? cachedComponent.default : (await downloadAndStoreComponent()).default;
  } catch (error) {
    console.error('Error fetching component:', error);
    return () => {
      navigation.navigate('Home');
      show(locale.t('LoginScreen:NetworkError'), 'error');
    };
  }
}

export const deviceOrientation = () => {
  if (isTablet()) {
    Orientation.lockToLandscape();
  } else {
    Orientation.lockToPortrait();
  }
};

// Check if the internet is available
export const internetIsAvailable = async () => {
  const netInfo = await NetInfo.fetch();
  return netInfo.isConnected;
};

export const getBasePathContext = (
  isDemoTry: boolean,
  isDev: boolean,
): string => {
  if (isDemoTry) {
    return '';
  }

  return isDev ? References.SubappContextPath : References.EtendoContextPath;
};
