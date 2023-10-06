import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  formatLanguageUnderscore,
  languageByDefault,
  supportedLocales
} from "../i18n/config";
import { ILanguage } from "../interfaces";
import Languages from "../ob-api/objects/Languages";
import locale from "../i18n/locale";
import { NativeModules, Platform } from "react-native";
import languageCurrentInitialize from "../../constant";

// Gets the current device language
function getCurrentLanguage() {
  const deviceLanguageAbbreviation =
    Platform.OS === "ios"
      ? NativeModules.SettingsManager.settings.AppleLocale ||
        NativeModules.SettingsManager.settings.AppleLanguages[0]
      : NativeModules.I18nManager.localeIdentifier;
  const languageFormattedSupported = formatLanguageUnderscore(
    deviceLanguageAbbreviation.slice(0, 2),
    true
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

  const languageSelected = await loadLanguage();
  const languageSelectedFormatted = formatLanguageUnderscore(languageSelected);
  const supportedLanguages = getSupportedLanguages();

  const isCurrentInLngList = etendoLanguages?.some(
    (item: any) =>
      item.language === languageSelectedFormatted ||
      item.language === languageSelected
  );

  const languageList =
    etendoLanguages.length === 0 || !isCurrentInLngList
      ? [formatObjectLanguage(languageByDefault())]
      : findIntersection(etendoLocalLanguages, supportedLanguages);

  return {
    list: languageList,
    isCurrentInlist: isCurrentInLngList
  };
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
  try {
    const languageStored = await loadLanguage();
    if (languageStored) {
      locale.setCurrentLanguage(formatLanguageUnderscore(languageStored, true));
      return languageStored;
    }
    locale.init();
    let currentLanguage = getCurrentLanguage();
    locale.setCurrentLanguage(formatLanguageUnderscore(currentLanguage, true));
    await saveLanguage(currentLanguage);
    return currentLanguage;
  } catch (error) {
    console.error("Error", error);
  }
};

export const changeLanguage = async (input: string, setLenguageRedux: any) => {
  locale.setCurrentLanguage(input);
  languageCurrentInitialize.set(input);
  await saveLanguage(input);
  await setLenguageRedux();
};

export const formatObjectLanguage = (language: string): ILanguage => {
  const localLanguage = formatLanguageUnderscore(language, true);
  return {
    id: localLanguage,
    value: formatLanguageUnderscore(language, false),
    label: supportedLocales[localLanguage].name
  };
};

const findIntersection = (
  arr1: ILanguage[],
  arr2: ILanguage[]
): ILanguage[] => {
  const map: { [value: string]: ILanguage } = {};

  for (const lang of arr1) {
    map[lang.value] = lang;
  }

  const intersection: ILanguage[] = arr2.filter(
    (lang) => map[lang.value] !== undefined
  );

  return intersection;
};

export const getSupportedLanguages = () => {
  const localLanguages = Object.keys(supportedLocales);
  return localLanguages.map((localLanguage) => {
    return formatObjectLanguage(localLanguage);
  });
};

let language: string = "";

export const languageCurrentInitialize = {
  get: () => language,
  set: (newLanguage: string) => {
    language = newLanguage;
  }
};
