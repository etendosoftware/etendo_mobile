import React, { useEffect, useMemo, useState } from "react";
import { AppRegistry } from "react-native";
import { name as appName } from "./app.json";
import MainAppContext from "./src/contexts/MainAppContext";
import locale from "./src/i18n/locale";
import Windows from "./src/stores/Windows";
import User from "./src/stores/User";
import Languages from "./src/ob-api/objects/Languages";
import { supportedLocales } from "./src/i18n/config";
import Orientation from "react-native-orientation-locker";
import { isTablet } from "./hook/isTablet";
import App from "./App";
import { ContainerProvider } from "./src/contexts/ContainerContext";

interface Language {
  id: string;
  value: string;
  label: string;
}

const AppWithContainer = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [token, setToken] = useState<boolean>(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      if (isTablet()) {
        Orientation.lockToLandscape();
      } else {
        Orientation.lockToPortrait();
      }

      locale.init();
      const storagedLanguage = await User.loadLanguage();
      await updateLanguageList();
      if (storagedLanguage) {
        locale.setCurrentLanguage(storagedLanguage);
        await User.saveLanguage(storagedLanguage);
        setSelectedLanguage(storagedLanguage);
      } else {
        await User.saveLanguage(locale.getDeviceLocale().replace("-", "_"));
        setSelectedLanguage(await User.loadLanguage());
      }
    };
    fetchInitialData();
  }, []);
  const changeLanguage = async (input: string) => {
    locale.setCurrentLanguage(input);
    if (User.user) {
      Windows.loading = true;
      User.saveLanguage(input);
      Windows.loading = false;
    }
    setSelectedLanguage(input);
  };

  const getLanguages = async () => {
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

  const updateLanguageList = async () => {
    const languages = await getLanguages();
    setLanguages(languages);
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
  const value = useMemo(
    () => ({
      changeLanguage,
      selectedLanguage,
      languages,
      updateLanguageList,
      setToken,
      token
    }),
    [
      changeLanguage,
      selectedLanguage,
      languages,
      updateLanguageList,
      setToken,
      token
    ]
  );
  return (
    <MainAppContext.Provider value={value}>
      <ContainerProvider>
        <App />
      </ContainerProvider>
    </MainAppContext.Provider>
  );
};

AppRegistry.registerComponent(appName, () => AppWithContainer);
