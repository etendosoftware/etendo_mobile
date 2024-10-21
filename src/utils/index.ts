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

  // Check internet connection
  async function isConnected() {
    try {
      const response = await fetch(fullUrl);
      return response.ok;
    } catch {
      return false;
    }
  }

  // Download component from server
  async function downloadComponent() {
    const response = await fetch(fullUrl, {
      headers: {
        'Cache-Control': 'no-store',
        'Pragma': 'no-cache'
      }
    });
    if (!response.ok) throw new Error('Network response was not ok');

    const data = await response.text();
    if (!data.trim()) throw new Error('Received empty or invalid code from the server');

    return { data };
  }

  // Download and return component
  async function downloadAndReturnComponent() {
    const { data } = await downloadComponent();
    return getParsedModule(data, id, packages);
  }

  // Navigate to home on failure
  function handleFetchFailure() {
    navigation.navigate('Home');
    show(locale.t('LoginScreen:NetworkError'), 'error');
  }

  // Main logic
  try {
    if (!(await isConnected())) return handleFetchFailure;

    let component = await downloadAndReturnComponent();

    if (component) {
      return component;
    }

    return handleFetchFailure;
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
