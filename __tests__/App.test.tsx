/**
 * @format
 */

import 'react-native';
import React from 'react';
import { Text } from 'react-native';
import { render } from '@testing-library/react-native';

// Note: import explicitly to use the types shiped with jest.
import { it } from '@jest/globals';

const App = () => (
  <Text>App</Text>
);

it('renders correctly', () => {
  const { getByText } = render(<App />);

  const textElement = getByText(/App/i);
  expect(textElement).toBeTruthy();
});
