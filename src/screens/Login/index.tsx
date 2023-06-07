import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Dimensions,
  Image,
  StyleSheet,
  LogBox,
  Keyboard,
  TouchableWithoutFeedback,
  SafeAreaView,
  Pressable,
  Platform,
  ScrollView,
  TouchableOpacity
} from "react-native";
import { observer } from "mobx-react";
import { logout, User, Windows } from "../../stores";
import locale from "../../i18n/locale";
import {
  TextInput,
  Dialog,
  Text,
  Divider,
  List,
  Button
} from "react-native-paper";
import { Snackbar } from "../../globals";
import { Version } from "../../ob-api/objects";
import MainAppContext from "../../contexts/MainAppContext";
import Languages from "../../ob-api/objects/Languages";
import { getUrl, setUrl as setUrlOB, formatUrl } from "../../ob-api/ob";
import { defaultTheme } from "../../themes";
import { Picker } from "@react-native-picker/picker";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Input from "../../../ui/components/input/Input";
import ButtonUI from "../../../ui/components/button/Button";

import { isTablet } from "../../helpers/IsTablet";
import Orientation from "react-native-orientation-locker";
import { ContainerContext } from "../../contexts/ContainerContext";
import styles from "./styles";
import isAdmin from "../../helpers/isAdmin";

const MIN_CORE_VERSION = "3.0.202201";

interface EtendoLanguage {
  _entityName: string;
  active: string;
  client: string;
  createdBy: string;
  creationDate: string;
  id: string;
  language: string;
  name: string;
  organization: string;
  updated: string;
  updatedBy: string;
}

const deviceIsATablet = isTablet();

const LoginFunctional = observer((props) => {
  const context = useContext(MainAppContext);

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [coreVersion, setCoreVersion] = useState<string>("");
  const [showUpdateDialog, setShowUpdateDialog] = useState<boolean>(false);
  const [url, setUrl] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
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
        setShowSetUrl(url === null)
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

  const loadWindows = async (token) => {
    const { selectedLanguage, changeLanguage, updateLanguageList } = context;
    updateLanguageList();
    const etendoLanguages = (await Languages.getLanguages()) as EtendoLanguage[];
    if (
      etendoLanguages.filter((lang) => lang.language === selectedLanguage)
        .length === 0
    ) {
      changeLanguage("en_US");
    } else {
      if (!Windows.hydrated || !token) {
        await Windows.loadWindows(selectedLanguage);
      }
    }
  };

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
    setShowUpdateDialog(shouldShowUpdateDialog);
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

  const saveUrl = async () => {
    if (!url || url == "") return;
    await setUrlOB(url);
    await User.saveEnviromentsUrl(storedDataUrl);
    setShowSetUrl(false);
  };

  const addUrl = async () => {
    let currentValue = currentAddUrl;
    if (!currentValue || currentValue == "") return;
    currentValue = formatUrl(currentValue);

    setStoredDataUrl([...storedDataUrl, currentValue]);
    setCurrentAddUrl("");
  };

  const demo = async () => {
    await setUrlOB("https://demo.etendo.cloud/etendo");
    setUsername("admin");
    setPassword("admin");
    props.navigation.closeDrawer();
    setShowSetUrl(false);
  };

  const renderUrlItems = (items: any) => {
    if (items.length !== 0) {
      return items.map((item: any) => {
        return (
          <>
            <List.Item
              key={item}
              titleNumberOfLines={1}
              titleEllipsizeMode="tail"
              title={item}
              right={() => (
                <TouchableOpacity
                  onPress={() => {
                    let filteredItems = storedDataUrl.filter(
                      (url) => url !== item
                    );
                    setStoredDataUrl(filteredItems);
                  }}
                >
                  <Icon
                    name="delete-empty"
                    size={25}
                    color={defaultTheme.colors.primary}
                  />
                </TouchableOpacity>
              )}
            />
          </>
        );
      });
    } else {
      return (
        <Text
          allowFontScaling={false}
          style={{
            color: defaultTheme.colors.textSecondary,
            fontSize: 15,
            textAlign: "center",
            textAlignVertical: "center",
            height: 150
          }}
        >
          {locale.t("ShowLoadUrl:NotItemList")}
        </Text>
      );
    }
  };

  const renderPickerItems = (items) => {
    return items.map((item) => {
      return <Picker.Item key={item} label={item} value={item} />;
    });
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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView
        style={{ flex: 1, flexDirection: deviceIsATablet ? "row" : "column" }}
      >
        {deviceIsATablet && (
          <View style={styles.backgroundLoginImageContainer}>
            <Image
              source={require("../../../assets/background-login.png")}
              style={styles.backgroundLoginImage}
            />
          </View>
        )}

        <View
          style={
            deviceIsATablet ? styles.containerTablet : styles.containerMobile
          }
        >
          <View style={{ margin: deviceIsATablet ? 80 : 0, flex: 1 }}>
            <Pressable onPress={() => props.navigation.navigate("Settings")}>
              <View
                style={[
                  styles.settingsImageContainer,
                  { right: deviceIsATablet ? 0 : undefined }
                ]}
              >
                <Image
                  source={require("../../../assets/settings.png")}
                  style={styles.settingsImage}
                />
              </View>
            </Pressable>
            <Image
              source={
                deviceIsATablet
                  ? require("../../../assets/etendo-logotype-standard.png")
                  : require("../../../assets/etendo-logotype.png")
              }
              style={
                deviceIsATablet
                  ? styles.etendoLogotypeTablet
                  : styles.etendoLogotypeMobile
              }
            />
            <View style={styles.generalView}>
              <View style={styles.viewStyle}>
                <View style={styles.welcomeTitleContainer}>
                  <Text
                    style={[
                      styles.welcomeTitle,
                      { fontSize: deviceIsATablet ? 40 : 30 }
                    ]}
                  >
                    {locale.t("Welcome")}
                  </Text>
                  <Image
                    source={require("../../img/stars.png")}
                    style={styles.starsImage}
                  />
                </View>
                <Text
                  style={[
                    deviceIsATablet
                      ? styles.credentialsTextTablet
                      : styles.credentialsTextMobile,
                    {
                      marginTop:
                        deviceIsATablet || Platform.OS === "android" ? -40 : -20
                    }
                  ]}
                >
                  {locale.t("EnterCredentials")}
                </Text>

                <View style={styles.containerInputs}>
                  <Button
                    style={styles.buttonDemo}
                    onPress={async () => await demo()}
                  >
                    {locale.t("DemoTry")}
                  </Button>

                  <View style={styles.textInputStyle}>
                    <Input
                      typeField={"textInput"}
                      value={username}
                      onChangeText={(username) => setUsername(username)}
                      placeholder={locale.t("User")}
                      fontSize={16}
                      height={40}
                    />
                  </View>

                  <View style={styles.textInputStyle}>
                    <Input
                      typeField={"textInput"}
                      value={password}
                      onChangeText={(password) => setPassword(password)}
                      placeholder={locale.t("Password")}
                      fontSize={16}
                      height={40}
                      password={true}
                    />
                  </View>
                </View>
                <View style={styles.containerLogin}>
                  <View style={{ height: 50 }}>
                    <ButtonUI
                      onPress={submitLogin}
                      text={locale.t("Log in")}
                      typeStyle={"primary"}
                      typeSize="medium"
                      width="100%"
                      height={50}
                    />
                  </View>
                  <TouchableOpacity
                    activeOpacity={0.5}
                    style={{ marginTop: deviceIsATablet ? 0 : 25 }}
                    onPress={() => [setShowChangePassword(true)]}
                  >
                    <Text
                      allowFontScaling={false}
                      style={{
                        fontSize: 14,
                        textAlign: "right",
                        marginTop: 5,
                        color: defaultTheme.colors.textSecondary,
                        marginRight: 3
                      }}
                    >
                      {locale.t("Forgot_password")}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.containerCopyright}>
                  <Text style={styles.copyrightStyle}>
                    @ Copyright Etendo 2020-2023
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <Dialog visible={showSetUrl}>
            <Dialog.Title>
              <Text allowFontScaling={false}>
                {locale.t("ShowLoadUrl:Title")}
              </Text>
            </Dialog.Title>
            <Dialog.Content>
              <Text allowFontScaling={false}>
                {locale.t("ShowLoadUrl:Content")}
              </Text>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: defaultTheme.colors.primary,
                  borderRadius: 4
                }}
              >
                <Picker
                  selectedValue={url}
                  onValueChange={(url) => setUrl(url)}
                  style={[styles.picker]}
                  itemStyle={styles.pickerItem}
                >
                  <Picker.Item
                    key="disabled"
                    label={locale.t("ShowLoadUrl:PickerLabel")}
                    value=""
                  />
                  {renderPickerItems(storedDataUrl)}
                </Picker>
              </View>
            </Dialog.Content>

            <Dialog.Actions style={{ marginRight: 20 }}>
              <Button
                style={{
                  width: 110,
                  backgroundColor: defaultTheme.colors.accent,
                  marginRight: 10
                }}
                onPress={() => setShowAddUrl(true)}
              >
                {locale.t("ShowLoadUrl:Add")}
              </Button>
              <Button
                style={{
                  width: 110,
                  backgroundColor: defaultTheme.colors.backgroundSecondary
                }}
                onPress={() => saveUrl()}
              >
                {locale.t("Save")}
              </Button>
            </Dialog.Actions>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingHorizontal: 20,
                alignItems: "center"
              }}
            >
              <Divider style={{ padding: 1, flexGrow: 1 }} />
              <Text
                allowFontScaling={false}
                style={{ textAlignVertical: "center", margin: 20 }}
              >
                {locale.t("Or")}
              </Text>
              <Divider style={{ padding: 1, flexGrow: 1 }} />
            </View>
            <Dialog.Title>
              <Text allowFontScaling={false}>
                {locale.t("ShowLoadUrl:DemoTitle")}
              </Text>
            </Dialog.Title>
            <Dialog.Content>
              <Text>{locale.t("ShowLoadUrl:Demo")}</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button
                style={{
                  width: 150,
                  backgroundColor: defaultTheme.colors.backgroundSecondary,
                  margin: 10
                }}
                onPress={() => demo()}
              >
                {locale.t("DemoTry")}
              </Button>
            </Dialog.Actions>
          </Dialog>
        </View>
        <Dialog visible={showAddUrl}>
          <Dialog.Title>
            <Text allowFontScaling={false}>
              {locale.t("ShowLoadUrl:AddUrl")}
            </Text>
          </Dialog.Title>
          <Dialog.Content>
            <TextInput
              allowFontScaling={false}
              mode="outlined"
              placeholder={locale.t("ShowLoadUrl:Example")}
              value={currentAddUrl}
              onChangeText={(currentAddUrl) => setCurrentAddUrl(currentAddUrl)}
              textContentType="URL"
              label={locale.t("ShowLoadUrl:EnvironmentUrl")}
            />
            <Dialog.Actions style={{ marginTop: 20 }}>
              <Button
                style={{
                  backgroundColor: defaultTheme.colors.accent,
                  width: 120,
                  marginRight: 10
                }}
                onPress={() => addUrl()}
              >
                {locale.t("ShowLoadUrl:Add")}
              </Button>
              <Button
                style={{
                  width: 120,
                  backgroundColor: defaultTheme.colors.backgroundSecondary
                }}
                onPress={() => setShowAddUrl(false)}
              >
                {locale.t("ShowLoadUrl:Close")}
              </Button>
            </Dialog.Actions>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 10
              }}
            >
              <Divider style={{ padding: 1, flexGrow: 1 }} />
              <Text
                allowFontScaling={false}
                style={{
                  textAlignVertical: "center",
                  margin: 10,
                  fontSize: 15
                }}
              >
                {locale.t("ShowLoadUrl:ItemList")}
              </Text>
              <Divider style={{ padding: 1, flexGrow: 1 }} />
            </View>
            <View style={{ height: 200 }}>
              <ScrollView>{renderUrlItems(storedDataUrl)}</ScrollView>
            </View>
          </Dialog.Content>
        </Dialog>

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
