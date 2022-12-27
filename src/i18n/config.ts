export const supportedLocales = {
  "en-US": {
    name: "English",
    loadTranslations: () => require("../lang/enUS.json")
  },
  "es-ES": {
    name: "Español",
    loadTranslations: () => require("../lang/esES.json")
  }
};
