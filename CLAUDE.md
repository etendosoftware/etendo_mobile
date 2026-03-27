# Etendo Mobile — Claude Code Context

## Project Overview
React Native app (v0.78.3) for Etendo ERP mobile client.
- **Package:** `Etendo_Mobile` v1.15.0
- **Architecture:** Old Architecture (Paper/Bridge) — `newArchEnabled=false`
- **JS Engine:** Hermes
- **Branch convention:** `hotfix/ETP-XXXX`, `feature/ETP-XXXX`

## Build Commands

### Android
```bash
# Debug (requires Metro running first)
yarn start                        # Terminal 1 — keep running
yarn android                      # Terminal 2

# Release bundle (AAB)
cd android && ./gradlew bundleRelease

# Release APK
cd android && ./gradlew assembleRelease

# Debug APK only (no Metro needed)
cd android && ./gradlew assembleDebug
```

### iOS (macOS only)
```bash
cd ios && pod install             # After any dependency change
yarn ios
```

## Architecture & Key Files

| File | Purpose |
|------|---------|
| `src/components/packages.tsx` | Dynamic package registry for sub-apps |
| `src/themes.ts` | App theme (react-native-paper MD2) |
| `metro.config.js` | Metro bundler config — includes blockList and shims |
| `shims/react-native-document-picker.js` | Compat shim for etendo-ui-library |
| `patches/` | patch-package patches applied on `yarn install` |
| `android/app/build.gradle` | Android build config, signing, ABI filters |

## Active Patches (`patches/`)

### `react-native-screens+4.24.0.patch` — **DO NOT REMOVE**
Fixes two RN 0.78 incompatibilities:
1. Removes `ShadowTreeCommitOptions` parameter from `RNSScreenShadowNodeCommitHook.cpp/.h`
2. Removes `fullScreenSwipeEnabled` prop from Fabric codegen TypeScript files

Without this patch the app crashes immediately on startup with:
`SIGABRT in libreact_codegen_rnscreens.so → convertRawProp<RNSScreenFullScreenSwipeEnabled>`

4.25.0+ nightlies require RN 0.82, so stay on 4.24.0 + patch until a stable release is available.

## Known Issues

### Debug crash — "Only one instance allowed" (HostTarget)
**When:** Running a debug build without Metro bundler running.
**Cause:** RN 0.78 bug — dev support retries Metro connection (~15s), then triggers `recreateReactContextInBackground()` without unregistering the previous inspector instance.
**Fix:** Always start Metro before launching debug builds:
```bash
yarn start   # then install/launch the app
```

### iOS debug — same HostTarget crash
Same issue exists on iOS debug. Same fix (run Metro first).

## Dependency Notes

### react-native-document-picker (removed)
Replaced by `@react-native-documents/picker@^12.0.1`.
`etendo-ui-library` hardcodes `require('react-native-document-picker')` internally,
so a compatibility shim exists at `shims/react-native-document-picker.js` and is
aliased in `metro.config.js` via `resolver.extraNodeModules`.

### react-native-paper v5 (upgraded from v4)
Uses MD2 compatibility theme (`MD2LightTheme` / `MD2Theme`) to keep the same visual
appearance as v4. See `src/themes.ts`. No need for `DefaultTheme` or the old
`react-native-paper/lib/typescript/types` import path.

### react-native-screens v4.24.0
Pinned — do not upgrade. Next stable release requires RN 0.82+.

## Android Signing (local development)
For local release builds, `android/gradle.properties` includes:
```
MYAPP_UPLOAD_STORE_FILE=debug.keystore
MYAPP_UPLOAD_STORE_PASSWORD=android
MYAPP_UPLOAD_KEY_ALIAS=androiddebugkey
MYAPP_UPLOAD_KEY_PASSWORD=android
```
This uses the debug keystore for signing. **Production CI/CD uses secrets injected
via environment variables** (`MYAPP_UPLOAD_STORE_FILE`, etc.) — do not commit real keystores.

## iOS Platform Notes
- **Minimum iOS version:** 14.0 (bumped from 12.4 due to `@react-native-documents/picker`)
- **Xcode requirement:** 16+ (Swift 6.0 from `@react-native-documents/picker`)
- **Flipper:** Removed — was dropped in RN 0.77+
- After any dependency change on macOS: `cd ios && pod install`

## Metro Config
`metro.config.js` has two customizations:
1. **blockList** — excludes `.cxx` and `android/build` dirs to prevent Metro
   from watching CMake temp directories (avoids ENOENT crash during release builds)
2. **extraNodeModules** — aliases `react-native-document-picker` to the compat shim
