import AsyncStorage from "@react-native-async-storage/async-storage";
import { getLanguageSupported, supportedLocales } from "../i18n/config";
import { ILanguage } from "../interfaces";
import Languages from "../ob-api/objects/Languages";
import locale from "../i18n/locale";
import { NativeModules, Platform } from "react-native";

// Gets the current device language
function getCurrentLanguage() {
  const deviceLanguageAbbreviation =
    Platform.OS === "ios"
      ? NativeModules.SettingsManager.settings.AppleLocale ||
        NativeModules.SettingsManager.settings.AppleLanguages[0]
      : NativeModules.I18nManager.localeIdentifier;
  const languageFormattedSupported = getLanguageSupported(
    deviceLanguageAbbreviation.slice(0, 2)
  );
  return languageFormattedSupported;
}

// Get the languages supported by the app: from OBrest and localSupported
export const getLanguages = async () => {
  let etendoLanguages: any[] = [];
  try {
    etendoLanguages = await getServerLanguages();
  } catch (ignored) {}

  const etendoLocalLanguages = etendoLanguages.map((f) => {
    return { id: f.id, value: f.language, label: f.name };
  });

  const localLanguages = Object.keys(supportedLocales);
  const appLanguages = localLanguages.map((localLanguage) => {
    return formatObjectLanguage(localLanguage);
  });
  return etendoLanguages.length === 0
    ? appLanguages
    : inBoth(appLanguages, etendoLocalLanguages);
};

const inBoth = (list1: ILanguage[], list2: ILanguage[]): ILanguage[] => {
  let result: ILanguage[] = [];

  for (const element of list1) {
    let item1 = element,
      found = false;
    for (let j = 0; j < list2.length && !found; j++) {
      found = item1.value === list2[j].value;
    }
    if (found) {
      result.push(item1);
    }
  }

  return result;
};

// Gets the languages supported by the server
export const getServerLanguages = async () => {
  return Languages.getLanguages();
};

// Gets the language stored
export const loadLanguage = async () => {
  return AsyncStorage.getItem("selectedLanguage");
};

// Saves the language selected in localstorage
const saveLanguage = async (selectedLanguage) => {
  await AsyncStorage.setItem("selectedLanguage", selectedLanguage);
};

// Sets a language by default
export const languageDefault = async () => {
  locale.init();
  try {
    let storagedLanguage = await loadLanguage();
    if (!storagedLanguage) {
      storagedLanguage = getCurrentLanguage();
    }
    locale.setCurrentLanguage(storagedLanguage);
    await saveLanguage(storagedLanguage);
    return storagedLanguage;
  } catch (error) {
    console.log("Error", error);
  }
};

export const changeLanguage = async (input: string, setLenguageRedux: any) => {
  locale.setCurrentLanguage(input);
  await setLenguageRedux(input);
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
      return "en_US";
  }
};

export const formatObjectLanguage = (language: string): ILanguage => {
  const localLanguage = formatLanguageUnderscore(language, true);
  return {
    id: localLanguage,
    value: formatLanguageUnderscore(language, false),
    label: supportedLocales[localLanguage].name
  };
};
