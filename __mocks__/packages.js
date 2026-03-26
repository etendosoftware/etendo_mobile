/**
 * Jest mock for src/components/packages.tsx.
 *
 * packages.tsx imports every native package (vision-camera, document-picker,
 * screens, etc.) at load time to build a dynamic module registry for sub-apps.
 * Most of those packages crash in Jest because they call TurboModuleRegistry /
 * codegenNativeComponent at import time (native-only APIs).
 *
 * Tests that import src/utils/index (which transitively requires packages) only
 * need the module to load cleanly — they don't exercise the package registry
 * itself.  An empty object satisfies that requirement.
 */
module.exports = {};
