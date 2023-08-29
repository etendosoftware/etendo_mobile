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

const supportedLocalesAbbreviations = {
  en: "en-US",
  es: "es-ES"
};

export const getLanguageName = (language: string) => {
  const formattedLanguage = language ? language.replace("_", "-") : "en-US";
  return supportedLocales[formattedLanguage]
    ? supportedLocales[formattedLanguage].name
    : null;
};

export const getLanguageSupported = (languageDevice: string): string => {
  if (supportedLocalesAbbreviations[languageDevice]) {
    return supportedLocalesAbbreviations[languageDevice];
  }
  return supportedLocalesAbbreviations.en;
};
