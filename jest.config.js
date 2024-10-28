module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: [
    './node_modules/@react-native-async-storage/async-storage/jest/async-storage-mock.js',
    '<rootDir>/jestSetup.js',
  ],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native' +
    '|@react-native' +
    '|@react-navigation' +
    '|@react-native-async-storage/async-storage' +
    '|@react-native-community/datetimepicker' +
    '|@react-native-community/masked-view' +
    '|@react-native-community/netinfo' +
    '|@react-native-community/slider' +
    '|@react-native-picker/picker' +
    '|@reduxjs/toolkit' +
    '|@sentry/react-native' +
    '|axios' +
    '|date-fns' +
    '|etendo-ui-library' +
    '|etrest' +
    '|i18n-js' +
    '|mobx' +
    '|mobx-persist' +
    '|mobx-react' +
    '|react-native-blob-util' +
    '|react-native-codegen' +
    '|react-native-date-picker' +
    '|react-native-document-picker' +
    '|react-native-gesture-handler' +
    '|react-native-iphone-x-helper' +
    '|react-native-keyboard-aware-scroll-view' +
    '|react-native-loading-spinner-overlay' +
    '|react-native-markdown-display' +
    '|react-native-orientation-locker' +
    '|react-native-paper' +
    '|react-native-pdf' +
    '|react-native-permissions' +
    '|react-native-reanimated' +
    '|react-native-safe-area-context' +
    '|react-native-screens' +
    '|react-native-share' +
    '|react-native-svg' +
    '|react-native-svg-web' +
    '|react-native-swipeable-item' +
    '|react-native-swiper' +
    '|react-native-vector-icons' +
    '|react-native-vision-camera' +
    '|react-native-web' +
    '|react-native-worklets-core' +
    '|redux' +
    '|redux-persist' +
    '|rn-placeholder' +
    '|uuid' +
    'node_modules/(?!react-native-device-info)' +
    ')/)',
  ],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|svg)$': '<rootDir>/__mocks__/fileMock.js',
    'react-native-gesture-handler': '<rootDir>/__mocks__/react-native-gesture-handler.js',
  },
};
