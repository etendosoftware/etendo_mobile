// Importing required modules and libraries
import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Image,
  LogBox,
  Keyboard,
  TouchableWithoutFeedback,
  SafeAreaView,
  TouchableOpacity,
  Dimensions
} from "react-native";
import { observer } from "mobx-react";
import { User, Windows } from "../../stores";
import locale from "../../i18n/locale";
import { Dialog, Text, Button } from "react-native-paper";
import { Snackbar } from "../../globals";
import { Version } from "../../ob-api/objects";
import { getUrl, setUrl as setUrlOB } from "../../ob-api/ob";
import { defaultTheme } from "../../themes";
import Input from "etendo-ui-library/dist-native/components/input/Input";
import ButtonUI from "etendo-ui-library/dist-native/components/button/Button";
import { ConfigurationIcon } from "etendo-ui-library/dist-native/assets/images/icons/ConfigurationIcon";

import { isTablet } from "../../helpers/IsTablet";
import Orientation from "react-native-orientation-locker";
import { ContainerContext } from "../../contexts/ContainerContext";
import styleSheet from "./styles";
import Toast from "react-native-toast-message";
import { deviceStyles as styles } from "./deviceStyles";
import { References } from "../../constants/References";

// Constants
const MIN_CORE_VERSION = "3.0.202201";
const windowDimensions = Dimensions.get("window");
const deviceIsATablet = isTablet();
const { AdminUsername, AdminPassword } = References;

// Main functional component of the Login screen
const LoginFunctional = observer((props) => {
  // Initializing the state variables
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [coreVersion, setCoreVersion] = useState<string>("");
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [storedDataUrl, setStoredDataUrl] = useState<string[]>([]);
  const [showChangePassword, setShowChangePassword] = useState<boolean>(false);
  const [error, setError] = useState();

  useEffect(() => {
    const load = async () => {
      LogBox.ignoreLogs(["Require cycle: "]);

      if (deviceIsATablet) {
        Orientation.lockToLandscape();
      } else {
        Orientation.lockToPortrait();
      }

      try {
        User.loading = true;
        await User.loadToken();
        if (User.token) {
          await User.reloadUserData(User.token);
          loadDynamic();
          props.navigation.navigate("Home");
        } else {
          props.navigation.navigate("Login");
        }

        let storedEnviromentsUrl = await User.loadEnviromentsUrl();

        if (storedEnviromentsUrl) {
          setStoredDataUrl([...storedDataUrl, storedEnviromentsUrl]);
        }
      } catch (e) {
        Snackbar.showError(e.message);
      } finally {
        User.loading = false;
        Windows.loading = false;
      }
    };

    load();
  }, []);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardOpen(true);
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardOpen(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const loadDynamic = async () => {
    let storedEnviromentsUrl = await getUrl();
    const callUrlApps = `${storedEnviromentsUrl}/sws/com.etendoerp.dynamic.app.userApp`;
    await fetch(callUrlApps, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${User.token}`
      },
      mode: "no-cors"
    })
      .then(async (callApps) => {
        const data = await callApps.json();
        props.dispatch({ appsData: data.data, logged: true });
      })
      .catch((err) => console.error(err));
  };

  const submitLogin = async () => {
    try {
      User.loading = true;
      Windows.loading = true;
      try {
        setError(false);
        if (username === AdminUsername && password === AdminPassword) {
          demo();
        }
        await User.login(username, password);
        const isCoreVersionBeingChecked = await checkCoreCompatibility();
        if (!isCoreVersionBeingChecked) {
          await loadDynamic();
          props.navigation.closeDrawer();
        }
      } catch (error) {
        console.log(error);
        setError(true);

        if (error.message.includes("Invalid user name or password")) {
          await User.logout();
          Toast.show({
            type: "error",
            position: "bottom",
            text1: 'locale.t("ErrorUserPassword")',
            visibilityTime: 3000,
            autoHide: true
          });
        }
        if (error.message.includes("OBRest instance not initialized")) {
          Toast.show({
            type: "error",
            position: "bottom",
            text1: locale.t("LoginScreen:URLNotFound"),
            visibilityTime: 3000,
            autoHide: true
          });
        } else if (error.message.includes("Network Error")) {
          Toast.show({
            type: "error",
            position: "bottom",
            text1: locale.t("LoginScreen:NetworkError"),
            visibilityTime: 3000,
            autoHide: true
          });
        } else {
          Toast.show({
            type: "error",
            position: "bottom",
            text1: error.message,
            visibilityTime: 3000,
            autoHide: true
          });
        }
      }
    } catch (error) {
      Snackbar.showError(error.message);
      console.error(error);
    } finally {
      User.loading = false;
      Windows.loading = false;
    }
  };

  const checkCoreCompatibility = async () => {
    const newCoreVersion = (await Version.getVersion()).data[0].coreVersion;
    const shouldShowUpdateDialog =
      versionCompare(MIN_CORE_VERSION, coreVersion) > 0;
    setCoreVersion(newCoreVersion);
    return shouldShowUpdateDialog;
  };

  const versionCompare = (v1: any, v2: any, options?: any) => {
    let lexicographical = options && options.lexicographical,
      zeroExtend = options && options.zeroExtend,
      v1parts = v1.split("."),
      v2parts = v2.split(".");
    function isValidPart(x: string) {
      return (lexicographical ? /^\d+[A-Za-z]*$/ : /^\d+$/).test(x);
    }
    if (!v1parts.every(isValidPart) || !v2parts.every(isValidPart)) {
      return NaN;
    }
    if (zeroExtend) {
      while (v1parts.length < v2parts.length) v1parts.push("0");
      while (v2parts.length < v1parts.length) v2parts.push("0");
    }
    if (!lexicographical) {
      v1parts = v1parts.map(Number);
      v2parts = v2parts.map(Number);
    }
    for (let i = 0; i < v1parts.length; ++i) {
      if (v2parts.length == i) {
        return 1;
      }
      if (v1parts[i] == v2parts[i]) {
        continue;
      } else if (v1parts[i] > v2parts[i]) {
        return 1;
      } else {
        return -1;
      }
    }
    if (v1parts.length != v2parts.length) {
      return -1;
    }
    return 0;
  };

  const demo = async () => {
    User.loading = true;
    Windows.loading = true;
    await setUrlOB("https://demo.etendo.cloud/etendo");
    await User.login(AdminUsername, AdminPassword);
    await props.navigation.closeDrawer();
    Windows.loading = false;
    User.loading = false;
  };

  const welcomeText = (): string => {
    return deviceIsATablet ? locale.t("Welcome!") : locale.t("Welcome");
  };

  const getWelcomeContainer = () => {
    return windowDimensions.height > 605
      ? styleSheet.welcomeTitleContainer
      : styleSheet.welcomeTitleSmallContainer;
  };

  const ChangedPassword = () => {
    return (
      <Dialog
        visible={showChangePassword}
        style={{
          height: "25%",
          width: deviceIsATablet ? "50%" : "90%",
          justifyContent: "center",
          alignItems: "center",
          alignSelf: "center"
        }}
      >
        <Dialog.Content>
          <Text allowFontScaling={false}>{locale.t("Recover_password")}</Text>
        </Dialog.Content>
        <View style={{ width: "100%", alignSelf: "center" }}>
          <TouchableOpacity
            onPress={() => setShowChangePassword(false)}
            style={{
              backgroundColor: defaultTheme.colors.accent,
              width: "20%",
              alignSelf: "flex-end",
              marginRight: 20
            }}
          >
            <Button style={{ width: "100%", alignItems: "center" }}>Ok</Button>
          </TouchableOpacity>
        </View>
      </Dialog>
    );
  };

  return (
    <TouchableWithoutFeedback
      onPress={Keyboard.dismiss}
      accessible={false}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={styles.generalContainer}>
        <View style={[styles.backgroundContainer]}>
          <Image
            source={
              deviceIsATablet ? null : require("../../img/background.png")
            }
            style={styles.backgroundHeaderImage}
          />
        </View>
        {deviceIsATablet && (
          <View style={styles.backgroundLoginImageContainer}>
            <Image
              source={require("../../img/tablet-background.png")}
              style={styles.backgroundLoginImage}
            />
          </View>
        )}

        <View style={[styles.container]}>
          <View style={styles.buttonsDemoSettings}>
            <View style={styles.buttonDemo}>
              <ButtonUI
                height={43}
                width={98}
                typeStyle="terciary"
                onPress={() => demo()}
                text={locale.t("DemoTry")}
              />
            </View>
            <View style={styles.settingsImageContainer}>
              <ButtonUI
                onPress={() => props.navigation.navigate("Settings")}
                text={locale.t("Settings")}
                typeStyle="whiteBorder"
                height={47}
                width={110}
                image={<ConfigurationIcon style={styles.configurationImage} />}
              />
            </View>
          </View>
          {!keyboardOpen && (
            <View style={styles.etendoLogoContainer}>
              {windowDimensions.height > 605 && (
                <Image
                  source={require("../../../assets/etendo-logotype.png")}
                  style={styles.etendoLogotype}
                />
              )}
              <View style={getWelcomeContainer()}>
                <Text style={styles.welcomeTitle}>{welcomeText()}</Text>
                <Image
                  source={require("../../img/stars.png")}
                  style={styles.starsImage}
                />
              </View>
              <Text style={styles.credentialsText}>
                {locale.t("EnterCredentials")}
              </Text>
            </View>
          )}
          <View style={styles.containerInputs}>
            <View style={styles.textInputStyle}>
              <Text style={styles.textInputsHolders}>{locale.t("User")}</Text>
              <Input
                typeField={"textInput"}
                value={username}
                onChangeText={(username) => setUsername(username)}
                placeholder={locale.t("User")}
                fontSize={16}
                height={48}
                isError={error}
              />
            </View>

            <View style={styles.textInputStyle}>
              <Text style={styles.textInputsHolders}>
                {locale.t("Password")}
              </Text>
              <Input
                typeField={"textInputPassword"}
                value={password}
                onChangeText={(password) => setPassword(password)}
                placeholder={locale.t("Password")}
                fontSize={16}
                height={48}
                isError={error}
              />
            </View>
          </View>
          <View>
            <ButtonUI
              onPress={submitLogin}
              text={locale.t("Log in")}
              typeStyle={"primary"}
              width="100%"
              height={50}
            />
          </View>
          <TouchableOpacity
            activeOpacity={0.5}
            style={styles.changePasswordStyle}
            onPress={() => [setShowChangePassword(true)]}
          ></TouchableOpacity>

          <Text style={styles.copyRightStyle}>
            © Copyright Etendo 2020-2023
          </Text>
        </View>

        {ChangedPassword()}
        <Toast ref={(ref) => Toast.setRef(ref)} />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
});

const Login = (props) => {
  const { dispatch } = useContext(ContainerContext);

  return <LoginFunctional {...props} dispatch={dispatch} />;
};
export default Login;
