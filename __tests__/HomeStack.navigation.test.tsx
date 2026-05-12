import React from 'react';
import { render, act } from '@testing-library/react-native';
import { Provider } from 'react-redux';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const configureStore = require('redux-mock-store').default;
import { homeInnerNavRef } from '../src/navigation/navigationRef';

let capturedOnOptionSelectedProfile: ((route?: string) => Promise<void>) | undefined;

jest.mock('etendo-ui-library/dist-native/components/navbar/Navbar', () => ({
  __esModule: true,
  default: (props: any) => {
    capturedOnOptionSelectedProfile = props.onOptionSelectedProfile;
    return null;
  },
}));

jest.mock('etendo-ui-library/dist-native/components/navbar/components/DrawerLateral/DrawerLateral', () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock('etendo-ui-library/dist-native/assets/images/icons', () => ({
  UserIcon: () => null,
  SettingIcon: () => null,
}));

jest.mock('@react-navigation/native', () => ({
  useNavigationState: jest.fn().mockReturnValue({ routes: [{ name: 'Home' }], index: 0 }),
  useFocusEffect: jest.fn(),
}));

jest.mock('@react-navigation/stack', () => {
  const React = require('react');
  const Navigator = ({ children }: any) => React.createElement(React.Fragment, null, children);
  const Screen = () => null;
  return {
    createStackNavigator: jest.fn(() => ({ Navigator, Screen })),
  };
});

jest.mock('../hook/useUser', () => ({
  useUser: jest.fn().mockReturnValue({
    logout: jest.fn(),
    setCurrentLanguage: jest.fn(),
  }),
}));

jest.mock('../src/helpers/IsTablet', () => ({
  isTablet: jest.fn().mockReturnValue(false),
}));

jest.mock('../src/helpers/getLanguajes', () => ({
  changeLanguage: jest.fn(),
  languageCurrentInitialize: { get: jest.fn().mockReturnValue(null) },
}));

jest.mock('../src/navigation/HomeStack/dataDrawer', () => ({
  drawerData: jest.fn().mockReturnValue([]),
}));

jest.mock('../src/i18n/locale', () => ({
  __esModule: true,
  default: { t: jest.fn((key: string) => key), initTranslation: jest.fn() },
}));

jest.mock('../src/navigation/HomeStack/style', () => ({
  __esModule: true,
  default: { containerBackground: {}, container: {} },
}));

jest.mock('../src/utils', () => ({
  generateUniqueId: jest.fn((name: string) => `${name}_id`),
}));

jest.mock('../src/screens/Home', () => ({ __esModule: true, default: () => null }));
jest.mock('../src/screens/Settings', () => ({ __esModule: true, default: () => null }));
jest.mock('../src/screens/Profile', () => ({ __esModule: true, default: () => null }));
jest.mock('../src/components/MainScreen', () => ({ __esModule: true, default: () => null }));

jest.mock('../redux/user', () => ({
  selectBindaryImg: 'selectBindaryImg',
  selectData: 'selectData',
}));

jest.mock('../redux/window', () => ({
  selectMenuItems: 'selectMenuItems',
  setIsSubapp: jest.fn(() => ({ type: 'setIsSubapp' })),
  setMenuItems: jest.fn(() => ({ type: 'setMenuItems' })),
}));

jest.mock('../redux/shared-files-reducer', () => ({
  setSharedFiles: jest.fn(() => ({ type: 'setSharedFiles' })),
}));

jest.mock('../redux', () => ({
  useAppSelector: jest.fn().mockReturnValue(null),
  useAppDispatch: jest.fn().mockReturnValue(jest.fn()),
}));

const mockStore = configureStore([]);
const mockNavigation = { navigate: jest.fn(), goBack: jest.fn() };

const renderHomeStack = () => {
  jest.isolateModules(() => {});
  const HomeStack = require('../src/navigation/HomeStack').default;
  const store = mockStore({});
  return render(
    <Provider store={store}>
      <HomeStack navigation={mockNavigation} />
    </Provider>
  );
};

describe('HomeStack onOptionPressHandle navigation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    capturedOnOptionSelectedProfile = undefined;
    homeInnerNavRef.current = null;
  });

  it('navigates via homeInnerNavRef when available for Profile', async () => {
    const mockInnerNavigate = jest.fn();
    homeInnerNavRef.current = { navigate: mockInnerNavigate };

    renderHomeStack();

    await act(async () => {
      await capturedOnOptionSelectedProfile?.('Profile');
    });

    expect(mockInnerNavigate).toHaveBeenCalledWith('Profile');
    expect(mockNavigation.navigate).not.toHaveBeenCalled();
  });

  it('navigates via homeInnerNavRef when available for Settings', async () => {
    const mockInnerNavigate = jest.fn();
    homeInnerNavRef.current = { navigate: mockInnerNavigate };

    renderHomeStack();

    await act(async () => {
      await capturedOnOptionSelectedProfile?.('Settings');
    });

    expect(mockInnerNavigate).toHaveBeenCalledWith('Settings');
    expect(mockNavigation.navigate).not.toHaveBeenCalled();
  });

  it('falls back to outer navigation when homeInnerNavRef is null', async () => {
    homeInnerNavRef.current = null;

    renderHomeStack();

    await act(async () => {
      await capturedOnOptionSelectedProfile?.('Profile');
    });

    expect(mockNavigation.navigate).toHaveBeenCalledWith('Profile');
  });

  it('calls logout when route is logout', async () => {
    const { useUser } = require('../hook/useUser');
    const mockLogout = jest.fn().mockResolvedValue(undefined);
    useUser.mockReturnValue({ logout: mockLogout, setCurrentLanguage: jest.fn() });

    renderHomeStack();

    await act(async () => {
      await capturedOnOptionSelectedProfile?.('logout');
    });

    expect(mockLogout).toHaveBeenCalled();
  });
});
