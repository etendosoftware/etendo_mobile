import React, { useEffect, useState } from "react";
import Spinner from "react-native-loading-spinner-overlay";
import { withTheme } from "react-native-paper";
import locale from "../../i18n/locale";
import { defaultTheme } from "../../themes";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { languageDefault } from "../../helpers/getLanguajes";
import { useAppSelector } from "../../../redux";
import { selectSelectedLanguage } from "../../../redux/user";
import { selectIsSubapp } from "../../../redux/window";

const LoadingScreen = () => {
  const [visible, setVisible] = useState(false);
  const [isLocaled, setIsLocaled] = useState(false);
  const selectedLanguageRedux = useAppSelector(selectSelectedLanguage);
  const isSubappRedux = useAppSelector(selectIsSubapp);
  useEffect(() => {
    const getLanguageLocal = async () => {
      const languageStored = await AsyncStorage.getItem("selectedLanguage");
      const hasLanguage = !languageStored || !selectedLanguageRedux;
      if (hasLanguage) {
        await languageDefault();
        setIsLocaled(hasLanguage);
      }
    };
    getLanguageLocal();
    setVisible(true);
  }, []);

  const textLoading = () => {
    return isSubappRedux
      ? locale.t("LoadingScreen:downloadingText")
      : isLocaled
      ? locale.t("LoadingScreen:loadingText")
      : "Loading...";
  };

  return (
    <Spinner
      color={defaultTheme.colors.accent}
      overlayColor={defaultTheme.colors.primary}
      textStyle={{ color: defaultTheme.colors.surface }}
      visible={visible}
      textContent={textLoading()}
    />
  );
};

export default withTheme(LoadingScreen);
