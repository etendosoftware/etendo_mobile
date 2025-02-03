import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Login from '../../../src/screens/Login/index';
import { OBRest } from 'etrest';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { show } from 'etendo-ui-library/dist-native/components/alert/AlertManager';
import { internetIsAvailable } from '../../../src/utils';

beforeAll(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

jest.mock('../../../src/constants/References', () => ({
  References: {
    DemoUrl: 'https://demo.etendo.cloud/etendo/',
    EtendoDemo: 'https://demo.etendo.cloud',
    EtendoContextPath: '/etendo/',
    YES: 'YES',
    AdminUsername: 'admin',
    AdminPassword: 'admin'
  }
}));

jest.mock('react-native-keyboard-aware-scroll-view', () => {
  const { View } = require('react-native');
  return { KeyboardAwareScrollView: View };
});

jest.mock('../../../src/i18n/locale', () => ({
  t: (key: string) => key
}));

jest.mock('etrest');

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    setItem: jest.fn(),
    getItem: jest.fn().mockResolvedValue(null),
    multiSet: jest.fn(),
  },
}));

jest.mock('../../../src/utils', () => ({
  internetIsAvailable: jest.fn().mockResolvedValue(true),
  getContextPath: jest.fn().mockReturnValue('/etendo/')
}));

jest.mock('../../../src/ob-api/ob', () => ({
  formatEnvironmentUrl: jest.fn().mockReturnValue('https://demo.etendo.cloud'),
  getUrl: jest.fn().mockReturnValue('https://demo.etendo.cloud/etendo/'),
  setUrl: jest.fn(() => Promise.resolve())
}));

jest.mock('etendo-ui-library/dist-native/components/alert/AlertManager', () => ({
  show: jest.fn()
}));

jest.mock('../../../hook/useUser', () => ({
  useUser: () => ({
    login: jest.fn().mockResolvedValue(true),
    logout: jest.fn(),
    getImageProfile: jest.fn().mockResolvedValue(true),
  })
}));

jest.mock('etendo-ui-library/dist-native/components/button/Button', () => {
  const React = require('react');
  const { TouchableOpacity, Text } = require('react-native');
  return ({ onPress, text }) => (
    <TouchableOpacity onPress={onPress} testID="buttonUI">
      <Text>{text}</Text>
    </TouchableOpacity>
  );
});

const mockStore = configureStore({
  reducer: {
    user: () => ({
      data: {},
      selectedUrl: 'https://demo.etendo.cloud'
    }),
    window: () => ({
      error: false,
      isLoading: false
    })
  }
});

describe('Login Component', () => {
  const mockNavigation = {
    navigate: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (internetIsAvailable as jest.Mock).mockResolvedValue(true);
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('https://demo.etendo.cloud');
  });

  it('renders correctly', async () => {
    const { getByText } = render(
      <Provider store={mockStore}>
        <Login navigation={mockNavigation} />
      </Provider>
    );

    await waitFor(() => {
      expect(getByText('Log in')).toBeTruthy();
    });
  });

  it('handles login with valid credentials', async () => {
    const { getByText } = render(
      <Provider store={mockStore}>
        <Login navigation={mockNavigation} />
      </Provider>
    );

    (OBRest.loginWithUserAndPassword as jest.Mock).mockResolvedValueOnce(true);

    const loginButton = await waitFor(() => getByText('Log in'));
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(OBRest.loginWithUserAndPassword).toHaveBeenCalled();
    });
  });

  it('shows error for invalid credentials', async () => {
    const { getByText } = render(
      <Provider store={mockStore}>
        <Login navigation={mockNavigation} />
      </Provider>
    );

    (OBRest.loginWithUserAndPassword as jest.Mock).mockRejectedValueOnce(
      new Error('Invalid user name or password')
    );

    const loginButton = await waitFor(() => getByText('Log in'));
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(show).toHaveBeenCalledWith('ErrorUserPassword', 'error');
    });
  });

  it('handles network error', async () => {
    const { getByText } = render(
      <Provider store={mockStore}>
        <Login navigation={mockNavigation} />
      </Provider>
    );

    (internetIsAvailable as jest.Mock).mockResolvedValueOnce(false);

    const loginButton = await waitFor(() => getByText('Log in'));
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(show).toHaveBeenCalledWith('NoInternetConnection', 'error');
    });
  });

  it('navigates to settings screen', async () => {
    const { getByText } = render(
      <Provider store={mockStore}>
        <Login navigation={mockNavigation} />
      </Provider>
    );

    const settingsButton = await waitFor(() => getByText('Settings'));
    fireEvent.press(settingsButton);
    expect(mockNavigation.navigate).toHaveBeenCalledWith('Settings');
  });

  it('handles demo mode correctly', async () => {
    const { getByText } = render(
      <Provider store={mockStore}>
        <Login navigation={mockNavigation} />
      </Provider>
    );

    const demoButton = await waitFor(() => getByText('DemoTry'));
    fireEvent.press(demoButton);

    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('isDemoTry', 'YES');
    });
  });

  it('handles URL not found error', async () => {
    const mockStoreNoUrl = configureStore({
      reducer: {
        user: () => ({
          data: {},
          selectedUrl: null
        }),
        window: () => ({
          error: false,
          isLoading: false
        })
      }
    });

    const { getByText } = render(
      <Provider store={mockStoreNoUrl}>
        <Login navigation={mockNavigation} />
      </Provider>
    );

    const loginButton = await waitFor(() => getByText('Log in'));
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(show).toHaveBeenCalledWith('LoginScreen:URLNotFound', 'error');
    });
  });
});
