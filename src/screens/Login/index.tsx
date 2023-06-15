import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Image,
  LogBox,
  Keyboard,
  TouchableWithoutFeedback,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ViewStyle,
  ImageStyle,
  TextStyle,
  Dimensions
} from "react-native";
import { observer } from "mobx-react";
import { User, Windows } from "../../stores";
import locale from "../../i18n/locale";
import { Dialog, Text, List, Button } from "react-native-paper";
import { Snackbar } from "../../globals";
import { Version } from "../../ob-api/objects";
import { getUrl, setUrl as setUrlOB, formatUrl } from "../../ob-api/ob";
import { defaultTheme } from "../../themes";
import { Picker } from "@react-native-picker/picker";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Input from "../../../ui/components/input/Input";
import ButtonUI from "../../../ui/components/button/Button";
import { ConfigurationIcon } from "../../../ui/assets/images/icons/ConfigurationIcon";
import { isTablet } from "../../helpers/IsTablet";
import Orientation from "react-native-orientation-locker";
import { ContainerContext } from "../../contexts/ContainerContext";
import styles from "./styles";
import isAdmin from "../../helpers/isAdmin";

const MIN_CORE_VERSION = "3.0.202201";
const win = Dimensions.get("window");
const deviceIsATablet = isTablet();
const LoginFunctional = observer((props) => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [coreVersion, setCoreVersion] = useState<string>("");
  const [url, setUrl] = useState<string>("");
  const [showSetUrl, setShowSetUrl] = useState<boolean>(false);
  const [showAddUrl, setShowAddUrl] = useState<boolean>(false);
  const [currentAddUrl, setCurrentAddUrl] = useState<string>("");
  const [storedDataUrl, setStoredDataUrl] = useState<string[]>([]);
  const [showChangePassword, setShowChangePassword] = useState<boolean>(false);

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

        let url = await getUrl();
        setShowSetUrl(url === null);
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
    if (isAdmin(username, password)) {
      submitLogin();
    }
  }, [username, password]);

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
        await User.login(username, password);
        const isCoreVersionBeingChecked = await checkCoreCompatibility();
        if (!isCoreVersionBeingChecked) {
          loadDynamic();
          props.navigation.closeDrawer();
        }
      } catch (e) {
        console.error(e);
        await User.logout();
        if (e.message.includes("Request failed with status code 404")) {
          Snackbar.showError(locale.t("LoginScreen:URLNotFound"));
        } else if (e.message.includes("Network Error")) {
          Snackbar.showError(locale.t("LoginScreen:NetworkError"));
        } else {
          Snackbar.showError(e.message);
        }
      }
    } catch (e) {
      Snackbar.showError(e.message);
      console.error(e);
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
    await setUrlOB("https://demo.etendo.cloud/etendo");
    setUsername("admin");
    setPassword("admin");
    props.navigation.closeDrawer();
    setShowSetUrl(false);
  };

  const containerStyle = (): ViewStyle => {
    return deviceIsATablet ? styles.containerTablet : styles.containerMobile;
  };
  const buttonsDemoSettings = (): ViewStyle => {
    return deviceIsATablet
      ? styles.buttonsDemoSettingsTablet
      : styles.buttonsDemoSettings;
  };
  const buttonsContainers = (): ViewStyle => {
    return deviceIsATablet
      ? styles.buttonsContainers
      : styles.buttonsContainersMobile;
  };

  const etendoLogoContainer = (): ViewStyle => {
    return deviceIsATablet
      ? styles.etendoLogoContainerTablet
      : styles.etendoLogoContainerMobile;
  };

  const etendoLogotype = (): ImageStyle => {
    return deviceIsATablet
      ? styles.etendoLogotypeTablet
      : styles.etendoLogotypeMobile;
  };
  const containerInputs = (): ViewStyle => {
    return deviceIsATablet
      ? styles.containerInputs
      : styles.containerInputsMobile;
  };
  const copyRightStyle = (): ViewStyle => {
    return deviceIsATablet
      ? styles.copyRightStyle
      : styles.copyRightStyleMobile;
  };
  const credentialsText = (): TextStyle => {
    return deviceIsATablet
      ? styles.credentialsTextTabletM
      : styles.credentialsTextMobile;
  };
  const welcomeText = (): string => {
    return deviceIsATablet ? locale.t("Welcome!") : locale.t("Welcome");
  };
  const generalContainerStyle = (): ViewStyle => {
    return deviceIsATablet
      ? styles.generalContainerTablet
      : styles.generalContainerMobile;
  };
  const backgroundContainer = (): ViewStyle => {
    return deviceIsATablet
      ? styles.backgroundContainerTablet
      : styles.backgroundContainerMobile;
  };
  const settingsImageContainer = (): ViewStyle => {
    return deviceIsATablet
      ? styles.settingsImageContainerTablet
      : styles.settingsImageContainerMobile;
  };
  const changePasswordStyle = (): ViewStyle => {
    return deviceIsATablet
      ? styles.changePasswordTablet
      : styles.changePasswordMobile;
  };
  const getWelcomeContainer = () => {
    return win.height > 605
      ? styles.welcomeTitleContainer
      : styles.welcomeTitleSmallContainer;
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
      <SafeAreaView style={generalContainerStyle()}>
        <View style={[backgroundContainer()]}>
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

        <View style={[containerStyle()]}>
          <ScrollView style={{ flex: 1 }}>
            <View style={buttonsDemoSettings()}>
              <View style={styles.buttonDemo}>
                <ButtonUI
                  height={43}
                  width={98}
                  typeStyle="terciary"
                  onPress={() => demo()}
                  text={locale.t("DemoTry")}
                />
              </View>
              <View style={settingsImageContainer()}>
                <ButtonUI
                  onPress={() => props.navigation.navigate("Settings")}
                  text={locale.t("Settings")}
                  typeStyle="whiteBorder"
                  height={47}
                  width={110}
                  image={
                    <ConfigurationIcon style={styles.configurationImage} />
                  }
                />
              </View>
            </View>
            <View style={etendoLogoContainer()}>
              {win.height > 605 && (
                <Image
                  source={require("../../../assets/etendo-logotype.png")}
                  style={etendoLogotype()}
                />
              )}
              <View style={getWelcomeContainer()}>
                <Text style={styles.welcomeTitle}>{welcomeText()}</Text>
                <Image
                  source={require("../../img/stars.png")}
                  style={styles.starsImage}
                />
              </View>
              <Text style={credentialsText()}>
                {locale.t("EnterCredentials")}
              </Text>
            </View>

            <View style={containerInputs()}>
              <View style={styles.textInputStyle}>
                <Text style={styles.textInputsHolders}>{locale.t("User")}</Text>
                <Input
                  typeField={"textInput"}
                  value={username}
                  onChangeText={(username) => setUsername(username)}
                  placeholder={locale.t("User")}
                  fontSize={16}
                  height={48}
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
              style={changePasswordStyle()}
              onPress={() => [setShowChangePassword(true)]}
            ></TouchableOpacity>

            <Text style={copyRightStyle()}>© Copyright Etendo 2020-2023</Text>
          </ScrollView>
        </View>

        {ChangedPassword()}
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
});

const Login = (props) => {
  const { dispatch } = useContext(ContainerContext);

  return <LoginFunctional {...props} dispatch={dispatch} />;
};
export default Login;
