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

export const formatLanguageUnderscore = (
  language: string,
  dash?: boolean
): string => {
  switch (language) {
    case "en":
    case "en-US":
    case "en_US":
      return dash ? "en-US" : "en_US";
    case "es":
    case "es-ES":
    case "es_ES":
      return dash ? "es-ES" : "es_ES";
    default:
      return dash ? "en-US" : "en_US";
  }
};

export const getLanguageName = (language: string) => {
  const formattedLanguage = formatLanguageUnderscore(language, true);
  return supportedLocales[formattedLanguage]
    ? supportedLocales[formattedLanguage].name
    : null;
};
