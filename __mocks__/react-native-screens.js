/**
 * Jest mock for react-native-screens.
 *
 * The real package calls codegenNativeComponent (Fabric/New Architecture API)
 * at module load time. Since the app uses Old Architecture (newArchEnabled=false),
 * that API is not available in Jest, causing an immediate crash.
 * This stub replaces all screen components with plain View wrappers.
 */
const React = require('react');
const { View } = require('react-native');

const stub = ({ children }) => React.createElement(View, null, children);

module.exports = {
  enableScreens: () => {},
  enableFreeze: () => {},
  screensEnabled: () => true,
  freezeEnabled: () => false,
  isSearchBarAvailableForCurrentPlatform: false,
  executeNativeBackPress: () => {},
  compatibilityFlags: {},
  featureFlags: {},
  useTransitionProgress: () => ({ progress: { value: 1 } }),
  ScreenContext: React.createContext({}),
  Screen: stub,
  InnerScreen: stub,
  ScreenStack: stub,
  ScreenStackItem: stub,
  ScreenContainer: stub,
  ScreenStackHeaderConfig: stub,
  ScreenStackHeaderSubview: stub,
  ScreenStackHeaderLeftView: stub,
  ScreenStackHeaderCenterView: stub,
  ScreenStackHeaderRightView: stub,
  ScreenStackHeaderBackButtonImage: stub,
  ScreenStackHeaderSearchBarView: stub,
  SearchBar: stub,
  FullWindowOverlay: stub,
  ScreenFooter: stub,
  ScreenContentWrapper: stub,
  Tabs: stub,
};
