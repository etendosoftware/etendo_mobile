import 'react-native-reanimated/mock';

// react-native-paper's Dialog uses useSafeAreaInsets internally.
// Without a SafeAreaProvider, tests that render Dialog crash.
jest.mock('react-native-safe-area-context', () => {
  const RealModule = jest.requireActual('react-native-safe-area-context');
  const { View } = require('react-native');
  return {
    ...RealModule,
    SafeAreaProvider: ({ children }) => children,
    SafeAreaConsumer: ({ children }) => children({ top: 0, right: 0, bottom: 0, left: 0 }),
    useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
    useSafeAreaFrame: () => ({ x: 0, y: 0, width: 390, height: 844 }),
    SafeAreaView: View,
  };
});

const originalWarn = console.warn.bind(console);
global.console = {
  ...console,
  warn: (message) => {
    if (message.includes("textAlignVertical") || message.includes("shadow*")) {
      return;
    }
    originalWarn(message);
  },
  error: jest.fn(),
};
