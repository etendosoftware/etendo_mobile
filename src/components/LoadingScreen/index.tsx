import React, { useEffect, useState } from "react";
import Spinner from "react-native-loading-spinner-overlay";
import { withTheme } from "react-native-paper";
import locale from "../../i18n/locale";
import { defaultTheme, ITheme } from "../../themes";

const LoadingScreen = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    locale.init();
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
