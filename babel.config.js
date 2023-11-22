module.exports = function(api) {
  api.cache(true);
  return {
    plugins: [
      ["@babel/plugin-proposal-decorators", { legacy: true }],
      ["@babel/plugin-transform-flow-strip-types"],
      ["@babel/plugin-proposal-class-properties", { loose: true }],
      [
        "react-native-reanimated/plugin",
        {
          globals: ["__scanCodes"]
        }
      ]
    ],
    presets: ["module:metro-react-native-babel-preset"]
  };
};
