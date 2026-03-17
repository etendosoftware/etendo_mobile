const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const path = require('path');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  watchFolders: [],
  resolver: {
    blockList: [
      /node_modules\/.*\/android\/\.cxx\/.*/,
      /node_modules\/.*\/android\/build\/.*/,
      /android\/\.cxx\/.*/,
      /android\/build\/.*/,
    ],
    extraNodeModules: {
      'react-native-document-picker': path.resolve(
        __dirname,
        'shims/react-native-document-picker.js',
      ),
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
