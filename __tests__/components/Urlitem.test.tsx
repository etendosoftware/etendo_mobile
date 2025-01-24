import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { UrlItem } from '../../src/components/UrlItem';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { TouchableOpacity } from 'react-native';

const mockStore = configureStore([]);

describe('UrlItem', () => {
  const defaultProps = {
    item: 'https://test.com/context/path',
    setValueEnvUrl: jest.fn(),
    deleteUrl: jest.fn(),
    setIsUpdating: jest.fn(),
    modalUrl: false,
    url: '',
    setUrl: jest.fn(),
    resetLocalUrl: jest.fn(),
    handleOptionSelected: jest.fn(),
  };

  const store = mockStore({
    user: {
      contextPathUrl: '/old/context',
    },
  });

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

  it('handles the edit event correctly', () => {
    const { UNSAFE_getAllByType } = render(
      <Provider store={store}>
        <UrlItem {...defaultProps} />
      </Provider>
    );

    const touchables = UNSAFE_getAllByType(TouchableOpacity);
    fireEvent.press(touchables[1]); // Edit button

    expect(defaultProps.setValueEnvUrl).toHaveBeenCalled();
    expect(defaultProps.deleteUrl).toHaveBeenCalledWith(defaultProps.item);
    expect(defaultProps.setIsUpdating).toHaveBeenCalledWith(true);
  });

  it('handles the delete event correctly', () => {
    const { UNSAFE_getAllByType } = render(
      <Provider store={store}>
        <UrlItem {...defaultProps} />
      </Provider>
    );

    const touchables = UNSAFE_getAllByType(TouchableOpacity);
    fireEvent.press(touchables[2]); // Delete button
    fireEvent.press(touchables[1]); // Confirm button

    expect(defaultProps.deleteUrl).toHaveBeenCalledWith(defaultProps.item);
  });

  it('updates the context when the URL changes', () => {
    const { UNSAFE_getAllByType } = render(
      <Provider store={store}>
        <UrlItem {...defaultProps} />
      </Provider>
    );

    const touchables = UNSAFE_getAllByType(TouchableOpacity);
    fireEvent.press(touchables[1]); // Edit button

    expect(store.getActions()).toContainEqual({
      type: 'user/setContextPathUrl',
      payload: '/context/path',
    });
  });

  it('handles delete cancellation', () => {
    const { UNSAFE_getAllByType } = render(
      <Provider store={store}>
        <UrlItem {...defaultProps} />
      </Provider>
    );

    const touchables = UNSAFE_getAllByType(TouchableOpacity);
    fireEvent.press(touchables[2]); // Delete button
    fireEvent.press(touchables[2]); // Cancel button

    expect(defaultProps.deleteUrl).not.toHaveBeenCalled();
  });

  it('resets the local URL when deleted and there is no modal URL', () => {
    const { UNSAFE_getAllByType } = render(
      <Provider store={store}>
        <UrlItem {...defaultProps} />
      </Provider>
    );

    const touchables = UNSAFE_getAllByType(TouchableOpacity);
    fireEvent.press(touchables[2]); // Delete button
    fireEvent.press(touchables[1]); // Confirm button

    expect(defaultProps.setUrl).toHaveBeenCalledWith(null);
    expect(defaultProps.resetLocalUrl).toHaveBeenCalled();
  });
});
