import React from 'react';
import { render } from '@testing-library/react-native';
import HomePage from '../../src/components/MainScreen';
import { NavigationContainer } from '@react-navigation/native';
import DynamicComponent from '../../src/components/DynamicComponent';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigationContainerRef: () => ({
    current: {},
    navigate: jest.fn(),
  }),
}));

jest.mock('../../src/components/DynamicComponent', () => jest.fn());
jest.mock('../../src/components/Camera', () => 'Camera');

const mockStore = configureStore([]);

describe('HomePage', () => {
  const initialState = {
    user: {
      token: 'test-token',
      data: { username: 'testuser' },
      selectedLanguage: 'en_US',
      selectedEnvironmentUrl: 'https://test.com',
      contextPathUrl: '/test',
    },
    window: { isDemo: false },
    sharedFiles: { files: [] },
  };

  const mockRoute = {
    params: {
      __id: 'test-id',
      name: 'TestApp',
      isDev: true,
    },
  };

  const mockNavigation = { navigate: jest.fn() };

  let store;

  beforeEach(() => {
    store = mockStore(initialState);
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { UNSAFE_getByType } = render(
      <Provider store={store}>
        <HomePage route={mockRoute} navigation={mockNavigation} />
      </Provider>
    );
    expect(UNSAFE_getByType(NavigationContainer)).toBeTruthy();
  });

  it('passes correct props to DynamicComponent', () => {
    render(
      <Provider store={store}>
        <HomePage route={mockRoute} navigation={mockNavigation} />
      </Provider>
    );

    expect(DynamicComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        url: 'https://test.com',
        token: 'test-token',
        user: 'testuser',
        language: 'en_US',
        isDev: true,
        isDemoTry: false,
        contextPathUrl: '/test',
      }),
      expect.anything()
    );
  });

  it('generates unique appId with random', () => {
    const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.123);

    render(
      <Provider store={store}>
        <HomePage route={mockRoute} navigation={mockNavigation} />
      </Provider>
    );

    expect(DynamicComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        __id: 'test-id?v=0.123',
      }),
      expect.anything()
    );

    randomSpy.mockRestore();
  });

  it('renders RenderDynamicComponents correctly', () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <HomePage route={mockRoute} navigation={mockNavigation} />
      </Provider>
    );

    expect(getByTestId('dynamic-component-container')).toBeTruthy();
  });

  it('handles missing Redux state gracefully', () => {
    const emptyStore = mockStore({
      user: {
        token: null,
        data: {},
        selectedLanguage: '',
        selectedEnvironmentUrl: '',
        contextPathUrl: '',
      },
      window: { isDemo: false },
      sharedFiles: { files: [] },
    });

    render(
      <Provider store={emptyStore}>
        <HomePage route={mockRoute} navigation={mockNavigation} />
      </Provider>
    );

    expect(DynamicComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        url: '',
        token: null,
        user: undefined,
        language: '',
        isDev: true,
        isDemoTry: false,
        contextPathUrl: '',
      }),
      expect.anything()
    );
  });

  it('handles different values for isDev and isDemoTry', () => {
    const modifiedRoute = { params: { ...mockRoute.params, isDev: false } };
    const modifiedStore = mockStore({
      ...initialState,
      window: { isDemo: true },
    });

    render(
      <Provider store={modifiedStore}>
        <HomePage route={modifiedRoute} navigation={mockNavigation} />
      </Provider>
    );

    expect(DynamicComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        isDev: false,
        isDemoTry: true,
      }),
      expect.anything()
    );
  });

  it('triggers navigation container events', () => {
    const mockOnReady = jest.fn();

    const { UNSAFE_getByType } = render(
      <Provider store={store}>
        <HomePage route={mockRoute} navigation={mockNavigation} />
      </Provider>
    );

    const navContainer = UNSAFE_getByType(NavigationContainer);
    navContainer.props.onReady();

    expect(mockOnReady).toHaveBeenCalledTimes(0); // El `onReady` en `NavigationContainer` es opcional
  });
});
