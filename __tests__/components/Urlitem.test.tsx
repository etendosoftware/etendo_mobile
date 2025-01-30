import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { UrlItem } from '../../src/components/UrlItem';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { setContextPathUrl } from '../../redux/user';
import { TouchableOpacity } from 'react-native';

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

const mockDispatch = jest.fn();
jest.mock('../../redux', () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: jest.fn((selector) => selector({ user: { contextPathUrl: '/old/context' } })),
}));

const mockStore = configureStore([]);
const store = mockStore({
  user: {
    contextPathUrl: '/old/context',
  },
});

describe('UrlItem', () => {
  const defaultProps = {
    item: 'https://test.com/context/path',
    setValueEnvUrl: jest.fn(),
    deleteUrl: jest.fn(),
    setIsUpdating: jest.fn(),
    modalUrl: '',
    url: '',
    setUrl: jest.fn(),
    resetLocalUrl: jest.fn(),
    handleOptionSelected: jest.fn(),
    setLocalContextPath: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the URL correctly', () => {
    const { getByText } = render(
      <Provider store={store}>
        <UrlItem {...defaultProps} />
      </Provider>
    );
    expect(getByText('https://test.com/context/path')).toBeTruthy();
  });

  it('handles the edit event correctly', async () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <UrlItem {...defaultProps} />
      </Provider>
    );

    const editButton = getByTestId('edit-button');
    fireEvent.press(editButton);

    await waitFor(() => {
      expect(defaultProps.setValueEnvUrl).toHaveBeenCalled();
      expect(defaultProps.setIsUpdating).toHaveBeenCalledWith(true);
    });

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledTimes(1);
      expect(mockDispatch).toHaveBeenCalledWith(setContextPathUrl('/context/path'));
    });
  });

  it('updates the context when the URL changes', async () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <UrlItem {...defaultProps} />
      </Provider>
    );

    const editButton = getByTestId('edit-button');
    fireEvent.press(editButton);

    expect(defaultProps.deleteUrl).not.toHaveBeenCalled();
  });

  it('resets the local URL when deleted and there is no modal URL', () => {
    const { UNSAFE_getAllByType } = render(
      <Provider store={store}>
        <UrlItem {...defaultProps} />
      </Provider>
    );

    const touchables = UNSAFE_getAllByType(TouchableOpacity);
    fireEvent.press(touchables[2]);
    fireEvent.press(touchables[1]);

    expect(defaultProps.setUrl).toHaveBeenCalledWith(null);
    expect(defaultProps.resetLocalUrl).toHaveBeenCalled();
  });

  it('cancels the deletion of a URL', () => {
    const { UNSAFE_getAllByType } = render(
      <Provider store={store}>
        <UrlItem {...defaultProps} />
      </Provider>
    );

    const touchables = UNSAFE_getAllByType(TouchableOpacity);
    fireEvent.press(touchables[2]);
    fireEvent.press(touchables[0]);

    expect(defaultProps.deleteUrl).not.toHaveBeenCalled();
    expect(defaultProps.setUrl).not.toHaveBeenCalled();
    expect(defaultProps.resetLocalUrl).not.toHaveBeenCalled();
  });

  it('does not confirm the edit of a URL', async () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <UrlItem {...defaultProps} />
      </Provider>
    );

    const editButton = getByTestId('edit-button');
    fireEvent.press(editButton);

    await waitFor(() => {
      expect(defaultProps.setValueEnvUrl).toHaveBeenCalled();
      expect(defaultProps.setIsUpdating).toHaveBeenCalledWith(true);
    });

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith(setContextPathUrl('/context/path'));
  });

  it('handles invalid URL during edit', async () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <UrlItem {...defaultProps} item="invalid-url" />
      </Provider>
    );

    const editButton = getByTestId('edit-button');
    fireEvent.press(editButton);

    await waitFor(() => {
      expect(defaultProps.setValueEnvUrl).toHaveBeenCalled();
      expect(defaultProps.setIsUpdating).toHaveBeenCalledWith(true);
    });

    expect(mockDispatch).not.toHaveBeenCalledWith(setContextPathUrl('invalid-url'));
  });

  it('updates the global state when the context path changes', async () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <UrlItem {...defaultProps} />
      </Provider>
    );

    const editButton = getByTestId('edit-button');
    fireEvent.press(editButton);

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(setContextPathUrl('/context/path'));
    });
  });
});
