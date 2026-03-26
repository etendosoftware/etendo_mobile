/**
 * Jest mock for react-native-worklets-core.
 *
 * The real module calls TurboModuleRegistry.getEnforcing('Worklets') at import
 * time, which throws in Jest because the native binary is not available.
 * This stub exports no-op implementations of the public API.
 */
module.exports = {
  Worklets: {},
  worklet: fn => fn,
  useRunOnJS: (fn) => fn,
  useSharedValue: (initial) => ({ value: initial }),
  useWorklet: (fn) => fn,
};
