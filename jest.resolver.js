/**
 * Custom Jest resolver that removes the 'source' export condition.
 *
 * @react-navigation/* v7 and react-native-drawer-layout ship a "source"
 * condition in their package.json exports field that points to TypeScript
 * src/ files. Jest picks up this condition, causing parse errors because
 * those files contain ESM / TypeScript syntax that Babel can't transform
 * when the transformIgnorePatterns chain breaks.
 *
 * Filtering 'source' out forces Jest to fall through to the 'default'
 * condition, which resolves to the compiled JS files.
 */
module.exports = (moduleName, options) => {
  return options.defaultResolver(moduleName, {
    ...options,
    conditions: options.conditions
      ? options.conditions.filter(c => c !== 'source')
      : options.conditions,
  });
};
