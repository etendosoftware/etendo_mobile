import 'react-native-reanimated/mock';

global.console = {
  ...console,
  warn: (message) => {
    if (message.includes("textAlignVertical") || message.includes("shadow*")) {
      return;
    }
    console.warn(message);
  },
  error: jest.fn(),
};
