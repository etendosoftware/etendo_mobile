import React from 'react';
import { render, act } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import DynamicComponent from '../../src/components/DynamicComponent';
import { fetchComponent, getBasePathContext } from "../../src/utils";

jest.mock('../../src/utils', () => ({
  fetchComponent: jest.fn(),
  getBasePathContext: jest.fn(),
}));

jest.mock('../../src/components/LoadingScreen', () => 'LoadingScreen');

beforeAll(() => {
  jest.spyOn(console, 'info').mockImplementation(() => { });
});

afterAll(() => {
  jest.restoreAllMocks();
});

describe('DynamicComponent', () => {
  let store;
  const defaultProps = {
    __id: 'test-id',
    url: 'https://test.com',
    isDemoTry: false,
    isDev: false,
    navigationContainer: {},
    children: null,
  };

  beforeAll(() => {
    jest.spyOn(console, 'info').mockImplementation(() => { });
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    getBasePathContext.mockReturnValue('/context');

    store = configureStore({
      reducer: {
        user: (state = { contextPathUrl: '/etendo' }) => state,
      },
    });
  });

  it('shows LoadingScreen while loading', () => {
    const MockComponent = () => null;
    fetchComponent.mockResolvedValue({ default: MockComponent });

    const { UNSAFE_getByType } = render(
      <Provider store={store}>
        <DynamicComponent {...defaultProps} />
      </Provider>
    );

    expect(UNSAFE_getByType('LoadingScreen')).toBeTruthy();
  });

  it('calls fetchComponent with correct parameters', () => {
    const MockComponent = () => null;
    fetchComponent.mockResolvedValue({ default: MockComponent });

    render(
      <Provider store={store}>
        <DynamicComponent {...defaultProps} />
      </Provider>
    );

    expect(fetchComponent).toHaveBeenCalledWith(
      'test-id',
      'https://test.com/context',
      defaultProps.navigationContainer
    );
  });

  it('updates component when key props change', async () => {
    const MockComponent = () => null;
    fetchComponent.mockResolvedValue({ default: MockComponent });

    const { rerender, unmount } = render(
      <Provider store={store}>
        <DynamicComponent {...defaultProps} />
      </Provider>
    );

    await act(async () => {
      rerender(
        <Provider store={store}>
          <DynamicComponent {...defaultProps} __id="new-id" />
        </Provider>
      );
    });

    expect(fetchComponent).toHaveBeenCalledTimes(2);
    unmount();
  });

  it('passes props correctly to loaded component', async () => {
    const MockComponent = jest.fn(() => null);
    fetchComponent.mockResolvedValue({ default: MockComponent });

    const { unmount } = render(
      <Provider store={store}>
        <DynamicComponent {...defaultProps} testProp="test" />
      </Provider>
    );

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(MockComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        testProp: 'test',
        url: 'https://test.com',
      }),
      {}
    );

    unmount();
  });
});
