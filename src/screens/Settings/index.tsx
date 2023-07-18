//Imports
import React, { useEffect, useState, useContext } from "react";
import PickerList from "../../components/List";
import {
  View,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity
} from "react-native";
import locale from "../../i18n/locale";
import {
  List,
  withTheme,
  Button,
  Dialog,
  Portal,
  Text,
  Divider
} from "react-native-paper";
import { setUrl as setUrlOB, getUrl, formatUrl } from "../../ob-api/ob";
import { version } from "../../../package.json";
import { User } from "../../stores";
import { Snackbar } from "../../globals";
import MainAppContext from "../../contexts/MainAppContext";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { defaultTheme } from "../../themes";
import FormContext from "../../contexts/FormContext";
import { IField } from "../../components/Field";
import { Picker } from "@react-native-picker/picker";
import ButtonUI from "etendo-ui-library/dist-native/components/button/Button";
import { isTablet } from "../../helpers/IsTablet";
import { BackIcon } from "etendo-ui-library/dist-native/assets/images/icons/BackIcon";
import { deviceStyles as styles } from "./deviceStyles";
import { useFocusEffect } from "@react-navigation/native";
import { ContainerContext } from "../../contexts/ContainerContext";

const Settings = (props) => {
  //Images
  const logoUri = "utility/ShowImageLogo?logo=yourcompanylogin";
  const defaultLogoUri = "../../../assets/logo.png";
  //Context
  const mainAppContext = useContext(MainAppContext);
  const { getRecordContext } = useContext(FormContext);
  //States
  const [url, setUrl] = useState<string>(null);
  const [modalUrl, setModalUrl] = useState<string>(null);
  const [showChangeURLModal, setShowChangeURLModal] = useState<boolean>(false);
  const [logo, setLogo] = useState<string>(null);
  const [defaultLogo, setDefaultLogo] = useState<string>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>(null);
  const [showAddUrl, setShowAddUrl] = useState<boolean>(false);
  const [currentAddUrl, setCurrentAddUrl] = useState<string>("");
  const [storedDataUrl, setStoredDataUrl] = useState([]);
  const [appVersion, setAppVersion] = useState<string>(version);

  const { dispatch } = useContext(ContainerContext);

  useEffect(() => {
    const fetchUrlAndLogo = async () => {
      const tmpUrl = await getUrl();
      const tmpLogo = loadServerLogo(url); // Note: loadServerLogo should be a function in scope.
      const tmpDefaultLogo = require(defaultLogoUri);
      const tmpAppVersion = await getAppVersion(); // Note: getAppVersion should be a function in scope.
      let storedEnviromentsUrl = await User.loadEnviromentsUrl();

      if (storedEnviromentsUrl) {
        setStoredDataUrl(storedEnviromentsUrl);
      }
      setDefaultLogo(tmpDefaultLogo);
      setLogo(tmpLogo);
      setUrl(tmpUrl);
      setAppVersion(tmpAppVersion);
      setModalUrl(url ? url.toString() : tmpUrl);
    };
    fetchUrlAndLogo();
  }, []);

  const loadServerLogo = (url) => {
    let logo;
    if (url) {
      const logoUrl = url + logoUri;
      logo = { uri: logoUrl };
    } else {
      logo = require(defaultLogoUri);
    }
    return logo;
  };

  const showChangeURLModalFn = () => {
    if (!User.token) {
      setShowChangeURLModal(true);
    }
  };

  const hideChangeURLModal = () => {
    setShowChangeURLModal(false);
    setModalUrl(url);
  };

  const changeURL = async () => {
    if (!modalUrl || modalUrl == "") return;
    await User.saveEnviromentsUrl(storedDataUrl);
    const tmpUrl = await setUrlOB(modalUrl);
    const tmpLogo = loadServerLogo(url);

    setShowChangeURLModal(false);
    setModalUrl(url);
    setUrl(tmpUrl);
    setLogo(tmpLogo);
    dispatch({ type: "SET_URL", url: tmpUrl });
  };

  const onLogoError = ({ nativeEvent }) => {
    Snackbar.showError(nativeEvent.error);
  };

  const onChangeModalPicker = async (field: IField, value: string) => {
    setSelectedLanguage(value ? value : field.toString());
    const { changeLanguage } = mainAppContext;
    changeLanguage(value ? value : field.toString());
  };

  const onChangePicker = (item: string) => {
    setSelectedLanguage(item);
  };

  const addUrl = async () => {
    let currentValue = currentAddUrl;
    if (!currentValue || currentValue == "") return;
    currentValue = formatUrl(currentValue);
    setStoredDataUrl([...storedDataUrl, currentValue]);
    setCurrentAddUrl([]);
  };

  const renderUrlItems = (items) => {
    if (items.length !== 0) {
      return items.map((item) => {
        return (
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
        );
      });
    } else {
      return (
        <Text allowFontScaling={false} style={styles.NotItemList}>
          {locale.t("ShowLoadUrl:NotItemList")}
        </Text>
      );
    }
  };

  const renderPickerItems = (items) => {
    return items?.map((item) => (
      <Picker.Item key={item} label={item} value={item} />
    ));
  };

  const getAppVersion = async () => {
    const metadata = null;

    if (!metadata) {
      return version;
    }

    return `${metadata.appVersion} - ${metadata.label}`;
  };

  const handleBackButtonPress = () => {
    props.navigation.navigate("Home");
  };

  const handleBackButtonPressWithLogin = () => {
    props.navigation.navigate("Login");
  };

  const { languages } = mainAppContext;
  return (
    <>
      <View style={styles.container}>
        <View style={styles.backContainer}>
          <Text style={styles.settingsTitle}>{locale.t("Settings")}</Text>
          <ButtonUI
            image={<BackIcon style={styles.backIcon} />}
            height={32}
            width={84}
            typeStyle="terciary"
            text={locale.t("Back")}
            onPress={
              User?.token
                ? handleBackButtonPress
                : handleBackButtonPressWithLogin
            }
          />
        </View>
        <View style={styles.containerCardStyle}>
          <View style={styles.containerUrlStyle}>
            <View style={styles.urlTextsContainer}>
              <Text style={styles.urlTitle}>{locale.t("Settings:URL")}</Text>
              <Text style={styles.urlDescription}>{url}</Text>
            </View>
            {!User?.token ? (
              <ButtonUI
                height={45}
                width={118}
                typeStyle="primary"
                onPress={showChangeURLModalFn}
                text={locale.t("Settings:ChangeURL")}
              />
            ) : (
              <Text
                allowFontScaling={false}
                style={styles.CahngeUrlTextConfirmation}
              >
                {locale.t("Settings:ChangeURLLogoutConfirmation")}
              </Text>
            )}
          </View>
          <View style={styles.logoContainerStyles}>
            <Text style={styles.logoTitleStyles}>
              {locale.t("Settings:Logo")}
            </Text>
            <Image
              style={styles.logoImageStyles}
              defaultSource={defaultLogo}
              source={logo}
              onError={onLogoError}
            />
          </View>
          <View style={styles.languageContainerStyles}>
            <FormContext.Provider
              value={{
                getRecordContext,
                onChangePicker: onChangeModalPicker,
                onChangeSelection: onChangePicker
              }}
            >
              <Text style={styles.languageText}>
                {locale.t("Settings:Language")}
              </Text>
              <PickerList
                pickerItems={languages}
                field={{
                  id: "Language Field",
                  name: "",
                  readOnly: false,
                  column: { updatable: true },
                  columnName: null
                }}
                value={
                  selectedLanguage
                    ? selectedLanguage
                    : mainAppContext.selectedLanguage
                }
              />
            </FormContext.Provider>
          </View>

          <Portal>
            <Dialog visible={showChangeURLModal} onDismiss={hideChangeURLModal}>
              <Dialog.Title>
                {locale.t("Settings:ChangeServerURL")}
              </Dialog.Title>
              <Dialog.Content>
                <Picker
                  selectedValue={modalUrl}
                  onValueChange={(newModalUrl) => setModalUrl(newModalUrl)}
                  itemStyle={{ paddingLeft: 15, marginLeft: 15 }}
                >
                  <Picker.Item
                    key="disabled"
                    label={locale.t("ShowLoadUrl:PickerLabel")}
                    value=""
                  />
                  {renderPickerItems(storedDataUrl)}
                </Picker>
              </Dialog.Content>
              <Dialog.Actions>
                <Button
                  style={{
                    width: 110,
                    backgroundColor: defaultTheme.colors.accent,
                    marginRight: 10
                  }}
                  onPress={() => setShowAddUrl(true)}
                >
                  {" "}
                  {locale.t("ShowLoadUrl:Add")}
                </Button>
                <Button
                  style={{
                    width: 110,
                    backgroundColor: defaultTheme.colors.backgroundSecondary
                  }}
                  onPress={changeURL}
                >
                  {locale.t("Save")}
                </Button>
              </Dialog.Actions>
            </Dialog>

            <Dialog visible={showAddUrl}>
              <Dialog.Title>{locale.t("ShowLoadUrl:AddUrl")}</Dialog.Title>
              <Dialog.Content>
                <Text>{locale.t("ShowLoadUrl:EnvironmentUrl")}</Text>
                <TextInput
                  allowFontScaling={false}
                  placeholder={locale.t("ShowLoadUrl:Example")}
                  onChangeText={(newCurrentAddUrl) =>
                    setCurrentAddUrl(newCurrentAddUrl)
                  }
                  defaultValue={currentAddUrl}
                  textContentType="URL"
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
          </Portal>
        </View>
      </View>
      {isTablet() ? (
        <View style={styles.copyrightTablet}>
          <Text allowFontScaling={false}>
            {" "}
            {locale.t("Settings:AppVersion", { version: appVersion })}{" "}
          </Text>
          <Text allowFontScaling={false}>© Copyright Etendo 2020-2023</Text>
        </View>
      ) : null}
    </>
  );
};

export default withTheme(Settings);
