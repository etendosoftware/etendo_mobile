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

export const getLanguageName = (language: string) => {
  const formattedLanguage = language.replace("_", "-");
  return supportedLocales[formattedLanguage]
    ? supportedLocales[formattedLanguage].name
    : null;
};
