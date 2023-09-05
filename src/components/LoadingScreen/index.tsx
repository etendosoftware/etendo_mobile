import React, { useEffect, useState } from "react";
import Spinner from "react-native-loading-spinner-overlay";
import { withTheme } from "react-native-paper";
import locale from "../../i18n/locale";
import { defaultTheme } from "../../themes";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { languageDefault } from "../../helpers/getLanguajes";

const LoadingScreen = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const getLanguageLocal = async () => {
      const language = await AsyncStorage.getItem("selectedLanguage");
      if (!language) {
        await languageDefault();
      }
    };
    getLanguageLocal();
    setVisible(true);
  }, []);

  return (
    <Spinner
      color={defaultTheme.colors.accent}
      overlayColor={defaultTheme.colors.primary}
      textStyle={{ color: defaultTheme.colors.surface }}
      visible={visible}
      textContent={locale.t("LoadingScreen:loadingText")}
    />
  );
};

export default withTheme(LoadingScreen);
