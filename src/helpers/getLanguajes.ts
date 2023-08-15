import AsyncStorage from "@react-native-async-storage/async-storage";
import { supportedLocales } from "../i18n/config";
import { Language } from "../interfaces";
import Languages from "../ob-api/objects/Languages";
import locale from "../i18n/locale";

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
    return {
      id: localLanguage,
      value: localLanguage.replace("-", "_"),
      label: supportedLocales[localLanguage].name
    };
  });

  return etendoLanguages.length === 0
    ? appLanguages
    : inBoth(appLanguages, etendoLocalLanguages);
};

const inBoth = (list1: Language[], list2: Language[]): Language[] => {
  let result: Language[] = [];

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

const getServerLanguages = async () => {
  return Languages.getLanguages();
};

const loadLanguage = async () => {
  return AsyncStorage.getItem("selectedLanguage");
};

const saveLanguage = async (selectedLanguage) => {
  await AsyncStorage.setItem("selectedLanguage", selectedLanguage);
};

export const languageDefault = async () => {
  locale.init();
  try {
    let storagedLanguage = await loadLanguage();
    if (storagedLanguage) {
      locale.setCurrentLanguage(storagedLanguage);
    } else {
      storagedLanguage = locale.getDeviceLocale().replace("-", "_");
    }
    await saveLanguage(storagedLanguage);
    return storagedLanguage;
  } catch (error) {
    console.log("Error", error);
  }
};
