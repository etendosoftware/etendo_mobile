/**
 * Jest mock for etendo-ui-library.
 *
 * The real index.js unconditionally imports both dist-web/components and
 * dist-native/components. In Jest (Node environment), dist-web loads
 * react-native-web's StyleSheet which tries to insert CSS into a DOM that
 * doesn't exist, causing a crash.
 *
 * This mock loads only the native build, which is what the app uses at runtime.
 */
const NativeComponents = require('../node_modules/etendo-ui-library/dist-native/components');
const NativeIcons = require('../node_modules/etendo-ui-library/dist-native/assets/images/icons');

module.exports = { ...NativeComponents, ...NativeIcons };
