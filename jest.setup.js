import 'react-native-reanimated/mock';

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
