/**
 * Module-level ref for the inner HomeStack navigator.
 * The Home screen (always mounted as the first inner screen) populates this
 * so that components rendered outside the inner Stack.Navigator (e.g. DrawerLateral)
 * can navigate within it.
 */
export const homeInnerNavRef: { current: any } = { current: null };
