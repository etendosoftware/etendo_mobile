import React, { useContext } from "react";
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
  Platform
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
import { getUrl, setUrl, formatUrl } from "../../ob-api/ob";
import { defaultTheme } from "../../themes";
import { Picker } from "@react-native-picker/picker";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import Input from "../../../ui/components/input/Input";
import ButtonUI from "../../../ui/components/button/Button";

import { isTablet } from "../../helpers/IsTablet";
import Orientation from "react-native-orientation-locker";
import { BLUE, GREY_60 } from "../../../ui/styles/colors";
import { GREY_PURPLE } from "../../styles/colors";
import { ContainerContext } from "../../contexts/ContainerContext";

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

interface State {
  username: string;
  password: string;
  url: String;
  error: string;
  coreVersion: string;
  showUpdateDialog: boolean;
  showSetUrl: boolean;
  showPassword: boolean;
  storedDataUrl: any;
  showAddUrl: boolean;
  currentAddUrl: string;
  showChangePassword: boolean;
}

const win = Dimensions.get("window");
const deviceIsATablet = isTablet();

@observer
class LoginClass extends React.Component<State> {
  static contextType = MainAppContext;

  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      error: "",
      coreVersion: "",
      showUpdateDialog: false,
      url: "",
      showPassword: false,
      showSetUrl: false,
      showAddUrl: false,
      currentAddUrl: "",
      storedDataUrl: [],
      showChangePassword: false
    };
  }

  componentDidMount = async () => {
    // FIXME: For the Input component of the UI Library
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
        this.loadDynamic();
        this.props.navigation.navigate("Home");
      } else {
        this.props.navigation.navigate("Login");
      }

      let storedEnviromentsUrl = await User.loadEnviromentsUrl();

      if (storedEnviromentsUrl) {
        this.setState({ storedDataUrl: storedEnviromentsUrl });
      }

      this.setState({ showSetUrl: (await getUrl()) === null });
    } catch (e) {
      Snackbar.showError(e.message);
    } finally {
      User.loading = false;
      Windows.loading = false;
    }
  };

  loadWindows = async (token) => {
    const {
      selectedLanguage,
      changeLanguage,
      updateLanguageList
    } = this.context;
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

  resetState = () => {
    this.setState({
      username: "",
      password: "",
      error: "",
      coreVersion: "",
      showUpdateDialog: false,
      showPassword: false,
      showAddUrl: false,
      currentAddUrl: "",
      storedDataUrl: []
    });
  };

  loadDynamic = async () => {
    let storedEnviromentsUrl = await getUrl();
    const callUrlApps = `${storedEnviromentsUrl}/sws/com.etendoerp.dynamic.app.userApp`;
    fetch(callUrlApps, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${User.token}`
      },
      mode: "no-cors"
    })
      .then(async (callApps) => {
        const data = await callApps.json();
        this.props.dispatch({ appsData: data.data, logged: true });
      })
      .catch((err) => console.error(err));
  };

  submitLogin = async () => {
    const { username, password } = this.state;
    try {
      User.loading = true;
      Windows.loading = true;
      try {
        await User.login(username, password);
        const isCoreVersionBeingChecked = await this.checkCoreCompatibility();
        if (!isCoreVersionBeingChecked) {
          this.loadDynamic();
          this.props.navigation.closeDrawer();
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

  onConfirmVersionUpdate = (option) => {
    if (option === "logout") logout();
    this.setState({ showUpdateDialog: false });
  };

  checkCoreCompatibility = async () => {
    const coreVersion = (await Version.getVersion()).data[0].coreVersion;
    const shouldShowUpdateDialog =
      this.versionCompare(MIN_CORE_VERSION, coreVersion) > 0;
    this.setState({ coreVersion });
    this.setState({ showUpdateDialog: shouldShowUpdateDialog });
    return shouldShowUpdateDialog;
  };

  versionCompare(v1, v2, options?) {
    var lexicographical = options && options.lexicographical,
      zeroExtend = options && options.zeroExtend,
      v1parts = v1.split("."),
      v2parts = v2.split(".");
    function isValidPart(x) {
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
    for (var i = 0; i < v1parts.length; ++i) {
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
  }

  saveUrl = async () => {
    if (!this.state.url || this.state.url == "") return;
    await setUrl(this.state.url);
    await User.saveEnviromentsUrl(this.state.storedDataUrl);
    this.setState({ showSetUrl: false });
  };

  addUrl = async () => {
    let currentValue = this.state.currentAddUrl;
    if (!currentValue || currentValue == "") return;
    currentValue = formatUrl(currentValue);
    this.setState({
      storedDataUrl: [...this.state.storedDataUrl, currentValue],
      currentAddUrl: ""
    });
  };

  demo = async () => {
    await setUrl("https://demo.etendo.cloud/etendo");
    this.setState({ username: "admin", password: "admin" });
    this.submitLogin();
    this.props.navigation.closeDrawer();
    this.setState({ showSetUrl: false });
  };

  renderUrlItems = (items: any) => {
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
                    let filteredItems = this.state.storedDataUrl.filter(
                      (url) => url !== item
                    );
                    this.setState({ storedDataUrl: filteredItems });
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

  renderPickerItems = (items) => {
    return items.map((item) => {
      return <Picker.Item key={item} label={item} value={item} />;
    });
  };

  ChangedPassword = () => {
    return (
      <Dialog
        visible={this.state.showChangePassword}
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
            onPress={() => this.setState({ showChangePassword: false })}
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

  render() {
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
              <Pressable
                onPress={() => this.props.navigation.navigate("Settings")}
              >
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
                          deviceIsATablet || Platform.OS === "android"
                            ? -40
                            : -20
                      }
                    ]}
                  >
                    {locale.t("EnterCredentials")}
                  </Text>

                  <View style={styles.containerInputs}>
                    <Button
                      style={styles.buttonDemo}
                      onPress={() => this.demo()}
                    >
                      {locale.t("DemoTry")}
                    </Button>

                    <View style={styles.textInputStyle}>
                      <Input
                        typeField={"textInput"}
                        value={this.state.username}
                        onChangeText={(username) => this.setState({ username })}
                        placeholder={locale.t("User")}
                        fontSize={16}
                        height={40}
                      />
                    </View>

                    <View style={styles.textInputStyle}>
                      <Input
                        typeField={"textInput"}
                        value={this.state.password}
                        onChangeText={(password) => this.setState({ password })}
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
                        onPress={this.submitLogin}
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
                      onPress={() => [
                        this.setState({ showChangePassword: true })
                      ]}
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
            <Dialog visible={this.state.showSetUrl}>
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
                    selectedValue={this.state.url}
                    onValueChange={(url) => this.setState({ url })}
                    style={[styles.picker]}
                    itemStyle={styles.pickerItem}
                  >
                    <Picker.Item
                      key="disabled"
                      label={locale.t("ShowLoadUrl:PickerLabel")}
                      value=""
                    />
                    {this.renderPickerItems(this.state.storedDataUrl)}
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
                  onPress={() => this.setState({ showAddUrl: true })}
                >
                  {locale.t("ShowLoadUrl:Add")}
                </Button>
                <Button
                  style={{
                    width: 110,
                    backgroundColor: defaultTheme.colors.backgroundSecondary
                  }}
                  onPress={() => this.saveUrl()}
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
                  onPress={() => this.demo()}
                >
                  {locale.t("DemoTry")}
                </Button>
              </Dialog.Actions>
            </Dialog>
          </View>
          <Dialog visible={this.state.showAddUrl}>
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
                value={this.state.currentAddUrl}
                onChangeText={(currentAddUrl) =>
                  this.setState({ currentAddUrl })
                }
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
                  onPress={() => this.addUrl()}
                >
                  {locale.t("ShowLoadUrl:Add")}
                </Button>
                <Button
                  style={{
                    width: 120,
                    backgroundColor: defaultTheme.colors.backgroundSecondary
                  }}
                  onPress={() => this.setState({ showAddUrl: false })}
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
                <ScrollView>
                  {this.renderUrlItems(this.state.storedDataUrl)}
                </ScrollView>
              </View>
            </Dialog.Content>
          </Dialog>

          {this.ChangedPassword()}
        </SafeAreaView>
      </TouchableWithoutFeedback>
    );
  }
}

const Login = (props) => {
  const { dispatch } = useContext(ContainerContext);

  return <LoginClass {...props} dispatch={dispatch} />;
};
export default Login;

const styles = StyleSheet.create({
  containerMobile: {
    flex: 1,
    paddingHorizontal: 30,
    paddingVertical: 50,
    backgroundColor: defaultTheme.colors.background
  },
  etendoLogotypeMobile: {
    resizeMode: "contain",
    width: 90,
    height: 90,
    margin: 0,
    padding: 0,
    alignSelf: "center"
  },
  credentialsTextMobile: {
    color: GREY_PURPLE,
    fontSize: 19.5,
    fontWeight: "500"
  },
  containerTablet: {
    flex: 1,
    backgroundColor: defaultTheme.colors.background
  },
  backgroundLoginImageContainer: {
    position: "relative",
    width: "34.5%"
  },
  backgroundLoginImage: {
    position: "absolute",
    left: 0,
    width: "100%",
    height: "100%"
  },
  settingsImageContainer: {
    position: "absolute",
    height: 40,
    width: 40,
    borderRadius: 8,
    justifyContent: "center"
  },
  settingsImage: {
    resizeMode: "contain",
    height: 24,
    width: 24,
    tintColor: GREY_60,
    alignSelf: "center"
  },
  etendoLogotypeTablet: {
    resizeMode: "contain",
    width: 150,
    height: 40,
    margin: 0,
    padding: 0,
    alignSelf: "flex-start"
  },
  credentialsTextTablet: {
    color: GREY_PURPLE,
    fontSize: 19.5,
    textAlign: "center",
    fontWeight: "500"
  },
  welcomeTitleContainer: {
    flexDirection: "row",
    alignSelf: "center",
    marginTop: 10
  },
  welcomeTitle: {
    color: BLUE,
    fontWeight: "700",
    fontSize: 30
  },
  starsImage: {
    position: "absolute",
    resizeMode: "contain",
    right: 0,
    width: 27,
    height: 27,
    marginRight: -30
  },

  generalView: {
    flex: 1,
    flexDirection: "column",
    paddingBottom: 16
  },
  viewStyle: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    height: "100%"
  },
  appbarStyle: {
    paddingTop: 28,
    paddingLeft: 8
  },
  containerLogo: {
    height: "15%"
  },
  logo: {
    flex: 1,
    alignSelf: "stretch",
    width: win.width,
    height: win.height
  },
  containerInputs: {
    display: "flex",
    flexDirection: "column",
    alignContent: "center",
    marginBottom: 0
  },
  buttonDemo: {
    flexDirection: "row",
    justifyContent: "flex-end",
    fontFamily: "Inter-Regular"
  },
  textInputStyle: {
    justifyContent: "center",
    height: 45,
    paddingVertical: 5,
    marginBottom: 20,
    marginTop: 10,
    width: "100%"
  },
  textInputIconStyle: {
    paddingTop: 10
  },
  containerLogin: {
    marginTop: 20,
    marginBottom: 20
  },
  buttonLogin: {
    height: 45,
    paddingVertical: 5,
    fontSize: 1
  },

  containerCopyright: {
    width: "100%",
    alignItems: "center"
  },
  copyrightStyle: {
    textAlign: "center",
    color: defaultTheme.colors.primary,
    fontSize: 14,
    backgroundColor: defaultTheme.colors.background
  },
  picker: {
    height: 44,
    borderColor: defaultTheme.colors.primary,
    borderWidth: 1
  },
  pickerItem: {
    height: 44
  }
});
