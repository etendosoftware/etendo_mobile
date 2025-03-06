import React from 'react';
import { render } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Settings from '../src/screens/Settings';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('react-native-keyboard-aware-scroll-view', () => ({
  KeyboardAwareScrollView: jest.fn(({ children }) => children),
}));

jest.mock('react-native-document-picker', () => ({
  pick: jest.fn(),
}));

jest.mock('react-native-default-preference', () => ({
  set: jest.fn(),
  get: jest.fn(),
  clear: jest.fn(),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  return Object.setPrototypeOf(
    {
      Image: {
        ...RN.Image,
        prefetch: jest.fn(() => Promise.resolve()),
      },
    },
    RN
  );
});

jest.mock('etrest', () => ({
  OBRest: {
    init: jest.fn(),
    loginWithToken: jest.fn(),
  },
}));

jest.mock('../src/i18n/locale', () => ({
  t: (key: string) => key,
}));

const mockStore = configureStore([]);
let store;

beforeAll(() => {
  const originalWarn = console.warn;
  console.warn = (message: string) => {
    if (message.includes("textAlignVertical") || message.includes("shadow*")) {
      return;
    }
    originalWarn(message);
  };
});

describe('Settings Screen Component', () => {
  beforeEach(() => {
    store = mockStore({
      user: {
        token: 'token',
        selectedUrl: 'https://demo.etendo.cloud',
        storedEnviromentsUrl: ['https://demo.etendo.cloud'],
      },
      window: {
        isDemo: false,
      },
    });
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('https://demo.etendo.cloud');
  });

  test('should render Settings screen without crashing', () => {
    const { getByText } = render(
      <Provider store={store}>
        <Settings />
      </Provider>
    );

    expect(getByText('Settings')).toBeTruthy();
  });
});
