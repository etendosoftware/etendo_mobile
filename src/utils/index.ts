import packages from '../components/packages';
import { isTablet } from '../../hook/isTablet';
import Orientation from 'react-native-orientation-locker';
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

export async function fetchComponent(id, url, navigation) {
  setAlertDefaultDuration(7000);
  const fullUrl = `${url}/${id}`;
  const dateLastDownBundleKey = `dateLastDownBundle-${id}`;

  // Check internet connection
  async function isConnected() {
    try {
      const response = await fetch(fullUrl);
      return response.ok;
    } catch {
      return false;
    }
  }

  // Remove cached data
  async function clearCache() {
    await AsyncStorage.removeItem(id);
    await AsyncStorage.removeItem(dateLastDownBundleKey);
  }

  // Save new component data
  async function storeComponentData(data, date) {
    await AsyncStorage.setItem(id, data);
    await AsyncStorage.setItem(dateLastDownBundleKey, date || '');
    storeKey(dateLastDownBundleKey);
  }

  // Download component from server
  async function downloadComponent() {
    const response = await fetch(fullUrl);
    if (!response.ok) throw new Error('Network response was not ok');

    const data = await response.text();
    if (!data.trim()) throw new Error('Received empty or invalid code from the server');

    return { data, date: response.headers.get('date') };
  }

  // Clear cache, download, and store component
  async function downloadAndStoreComponent() {
    await clearCache();
    const { data, date } = await downloadComponent();
    await storeComponentData(data, date);
    return getParsedModule(data, id, packages);
  }

  // Load component from cache
  async function loadCachedComponent() {
    const existingCode = await AsyncStorage.getItem(id);
    if (existingCode?.trim()) {
      return getParsedModule(existingCode, id, packages);
    }
    return null;
  }

  // Navigate to home on failure
  function handleFetchFailure() {
    navigation.navigate('Home');
    show(locale.t('LoginScreen:NetworkError'), 'error');
  }

  // Check if update is needed
  async function needsUpdate() {
    const response = await fetch(fullUrl, { method: 'HEAD' });
    const lastModifiedNew = response.headers.get('last-modified');
    const dateLastDownBundle = await AsyncStorage.getItem(dateLastDownBundleKey);
    return !lastModifiedNew || !dateLastDownBundle || dateLastDownBundle < lastModifiedNew;
  }

  // Main logic
  try {
    if (!(await isConnected())) return handleFetchFailure;

    let component = null;

    if (await needsUpdate()) {
      component = await downloadAndStoreComponent();
    } else {
      component = await loadCachedComponent();
    }

    if (component) {
      return component;
    }

    return await downloadAndStoreComponent();
  } catch (error) {
    console.error('Failed to fetch component:', error);
    return handleFetchFailure;
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
