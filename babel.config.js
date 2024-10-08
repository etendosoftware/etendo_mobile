/* eslint-disable @typescript-eslint/no-var-requires */

module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['module:metro-react-native-babel-preset'],
    plugins: [
      ["@babel/plugin-proposal-decorators", { legacy: true }],
      ["@babel/plugin-transform-flow-strip-types"],
      ["@babel/plugin-proposal-class-properties", { loose: true }],
      ['react-native-reanimated/plugin', { processNestedWorklets: true }],
      ['react-native-worklets-core/plugin'],
    ],
  };
};
