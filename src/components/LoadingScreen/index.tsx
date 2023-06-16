import React, { useEffect, useState } from "react";
import Spinner from "react-native-loading-spinner-overlay";
import { withTheme } from "react-native-paper";
import locale from "../../i18n/locale";
import { defaultTheme, ITheme } from "../../themes";

interface Props extends ITheme {
  visible: boolean;
}

const LoadingScreen = (props: Props) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setVisible(props.visible);
  }, [props.visible]);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      setVisible(false);
    }
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
