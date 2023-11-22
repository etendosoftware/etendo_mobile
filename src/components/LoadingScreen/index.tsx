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
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

const LoadingScreen = () => {
  const [isLocaled, setIsLocaled] = useState(false);
  const selectedLanguageRedux = useAppSelector(selectSelectedLanguage);
  const isSubappRedux = useAppSelector(selectIsSubapp);
  useEffect(() => {
    const getLanguageLocal = async () => {
      const languageStored = await AsyncStorage.getItem("selectedLanguage");
      const hasLanguage = !languageStored || !selectedLanguageRedux;
      if (hasLanguage) {
        await languageDefault();
      }
      setIsLocaled(true);
    };
    getLanguageLocal();
  }, []);

  const textLoading = () => {
    return isSubappRedux
      ? locale.t("LoadingScreen:downloadingText")
      : isLocaled
      ? locale.t("LoadingScreen:loadingText")
      : "Loading...";
  };

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={defaultTheme.colors.accent} />
      <Text style={styles.text}>{textLoading()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: defaultTheme.colors.primary,
    height: "100%",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  text: {
    color: defaultTheme.colors.surface,
    marginTop: 30,
    fontSize: 20,
    fontWeight: "bold"
  }
});

export default withTheme(LoadingScreen);
