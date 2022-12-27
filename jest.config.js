module.exports = {
  preset: "jest-expo",
  transformIgnorePatterns: [
    "node_modules/(?!(react-native|expo-secure-store|@unimodules|@sentry|@react-*|expo-.*|unimodules-*))"
  ]
};
