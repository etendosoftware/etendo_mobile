import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Image,
  LogBox,
  Keyboard,
  TouchableWithoutFeedback,
  SafeAreaView,
  Platform,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  ViewStyle,
  ImageStyle,
  TextStyle
} from "react-native";
import { observer } from "mobx-react";
import { User, Windows } from "../../stores";
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
import { getUrl, setUrl as setUrlOB, formatUrl } from "../../ob-api/ob";
import { defaultTheme } from "../../themes";
import { Picker } from "@react-native-picker/picker";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Input from "etendo-ui-library/dist-native/components/input/Input";
import ButtonUI from "etendo-ui-library/dist-native/components/button/Button";
import { ConfigurationIcon } from "etendo-ui-library/dist-native/assets/images/icons/ConfigurationIcon";


import { isTablet } from "../../helpers/IsTablet";
import Orientation from "react-native-orientation-locker";
import { ContainerContext } from "../../contexts/ContainerContext";
import styles from "./styles";
import isAdmin from "../../helpers/isAdmin";

const MIN_CORE_VERSION = "3.0.202201";

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

  const containerStyle = ():ViewStyle => { return deviceIsATablet
                ? styles.containerTablet
                : styles.containerMobile
  }
  const buttonsDemoSettings = ():ViewStyle => {
    return deviceIsATablet
                  ? styles.buttonsDemoSettingsTablet
                  : styles.buttonsDemoSettings
  } 
 const buttonsContainers = ():ViewStyle => {
    return deviceIsATablet ? styles.buttonsContainers : styles.buttonsContainersMobile
  } 

 const etendoLogoContainer = ():ViewStyle => {
    return deviceIsATablet
                ? styles.etendoLogoContainerTablet : styles.etendoLogoContainerMobile
  } 
  
   const etendoLogotype = ():ImageStyle => {
    return deviceIsATablet
                      ? styles.etendoLogotypeTablet
                      : styles.etendoLogotypeMobile
  } 
     const containerInputs = ():ViewStyle => {
    return deviceIsATablet ? styles.containerInputs : styles.containerInputsMobile
  } 
     const copyRightStyle = ():ViewStyle => {
    return deviceIsATablet ? styles.copyRightStyle : styles.copyRightStyleMobile
  } 
  const credentialsText = ():TextStyle => {
    return deviceIsATablet ? styles.credentialsTextTabletM  : styles.credentialsTextMobile
  } 
  const welcomeText = ():string => {
    return  deviceIsATablet ? locale.t("Welcome!") : locale.t("Welcome")
  } 
  const generalContainerStyle = ():ViewStyle => {
    return  deviceIsATablet
              ? styles.generalContainerTablet
              : styles.generalContainerMobile
  } 
  const backgroundContainer = ():ViewStyle => {
    return deviceIsATablet ? styles.backgroundContainerTablet : styles.backgroundContainerMobile

  } 
const settingsImageContainer = ():ViewStyle => {
    return deviceIsATablet ? styles.settingsImageContainerTablet : styles.settingsImageContainerMobile
} 
 const changePasswordStyle = ():ViewStyle => {
    return deviceIsATablet ? styles.changePasswordTablet : styles.changePasswordMobile

} 

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
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={ styles.keyboardAvoiding  }
      >
        <SafeAreaView
          style={generalContainerStyle()}
        >
          <View
            style={backgroundContainer()}
          >
            <Image
              source={deviceIsATablet ? null : require("../../img/background.png")}
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

          <View
            style={containerStyle()}
          >
            <View style={ buttonsContainers() }>
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
                <View
                  style={settingsImageContainer()}
                >
                  <ButtonUI
                    onPress={() => props.navigation.navigate("Settings")}
                    text={locale.t("Settings")}
                    typeStyle="whiteBorder"
                    height={47}
                    image=<ConfigurationIcon style={styles.configurationImage } />
                  />
                </View>
              </View>
              <View style={etendoLogoContainer()}>
                <Image
                  source={require("../../../assets/etendo-logotype.png")}
                  style={etendoLogotype()}
                />
                  <View style={styles.welcomeTitleContainer}>
                    <Text
                      style={styles.welcomeTitle}
                    >
                      {welcomeText()}
                    </Text>
                    <Image
                      source={require("../../img/stars.png")}
                      style={styles.starsImage}
                    />
                  </View>
                  <Text
                    style={credentialsText()}
                  >
                    {locale.t("EnterCredentials")}
                  </Text>
              </View>

                  <View style={containerInputs()}>
                    <View style={styles.textInputStyle}>
                      <Text style={styles.textInputsHolders}>
                        {locale.t("User")}
                      </Text>
                      <Input
                        typeField={"textInput"}
                        value={username}
                        onChangeText={(username) =>
                          setUsername(username)
                        }
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
                        onChangeText={(password) =>
                          setPassword(password)
                        }
                        placeholder={locale.t("Password")}
                        fontSize={16}
                        height={48}
                      />
                    </View>
                  </View>
                  <View>
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
                      onPress={() => [
                        setShowChangePassword(true)
                      ]}
                    ></TouchableOpacity>
                  </View>

                    <Text style={copyRightStyle()}>
                      @ Copyright Etendo 2020-2023
                    </Text>
                  
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
                  style={styles.pickerContainer}
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

              <Dialog.Actions style={styles.showAddUrlContainer}>
                <Button
                  style={styles.showAddUrl}
                  onPress={() => setShowAddUrl(showAddUrl)}
                >
                  {locale.t("ShowLoadUrl:Add")}
                </Button>
                <Button
                  style={styles.buttonSaveUrl}
                  onPress={() => saveUrl()}
                >
                  {locale.t("Save")}
                </Button>
              </Dialog.Actions>
              <View
                style={styles.dividerContainerStyle}
              >
                <Divider style={styles.dividerStyle} />
                <Text
                  allowFontScaling={false}
                  style={styles.orTextStyle}
                >
                  {locale.t("Or")}
                </Text>
                <Divider style={styles.dividerStyle} />
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
                  style={styles.buttonDemoTry}
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
              <KeyboardAvoidingView>
                <TextInput
                  allowFontScaling={false}
                  mode="outlined"
                  placeholder={locale.t("ShowLoadUrl:Example")}
                  value={currentAddUrl}
                  onChangeText={(currentAddUrl) =>
                    setCurrentAddUrl(currentAddUrl)
                  }
                  textContentType="URL"
                  label={locale.t("ShowLoadUrl:EnvironmentUrl")}
                />
              </KeyboardAvoidingView>
              <Dialog.Actions style={styles.ShowLoadUrlContainer}>
                <Button
                  style={styles.ShowLoadUrlAddButton}
                  onPress={() => addUrl()}
                >
                  {locale.t("ShowLoadUrl:Add")}
                </Button>
                <Button
                  style={styles.ShowLoadUrlCloseButton}
                  onPress={() => setShowAddUrl(false)}
                >
                  {locale.t("ShowLoadUrl:Close")}
                </Button>
              </Dialog.Actions>
              <View
                style={styles.itemListContainer}
              >
                <Divider style={{ padding: 1, flexGrow: 1 }} />
                <Text
                  allowFontScaling={false}
                  style={styles.itemListText}
                >
                  {locale.t("ShowLoadUrl:ItemList")}
                </Text>
                <Divider style={styles.dividerStyle} />
              </View>
              <View style={styles.scrollViewContainer}>
                <ScrollView>
                  {renderUrlItems(storedDataUrl)}
                </ScrollView>
              </View>
            </Dialog.Content>
          </Dialog>

          {ChangedPassword()}
        </SafeAreaView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
});

const Login = (props) => {
  const { dispatch } = useContext(ContainerContext);

  return <LoginFunctional {...props} dispatch={dispatch} />;
};
export default Login;
