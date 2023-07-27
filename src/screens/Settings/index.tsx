//Imports
import React, { useEffect, useState, useContext, useRef } from "react";
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
import { ContainerContext } from "../../contexts/ContainerContext";
import { SET_URL } from "../../contexts/actionsTypes";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { PRIMARY_100 } from "../../styles/colors";
import Input from "etendo-ui-library/dist-native/components/input/Input";

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
  const [valueEnvUrl, setValueEnvUrl] = useState<string>(null);
  const { dispatch } = useContext(ContainerContext);

  const inputRef = useRef(null);

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
    dispatch({ type: SET_URL, url: tmpUrl });
  };

  const onLogoError = () => {
    Toast.show({
      type: "info",
      position: "bottom",
      text1: locale.t("LoginScreen:LogoNotFound"),
      visibilityTime: 3000,
      autoHide: true
    });
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

  const UrlItem = ({ item }) => {
    console.log("item", item);
    const [clicked, setClicked] = useState(false);
    const [clickDelete, setClickDelete] = useState(false);
    const [clickEdit, setClickEdit] = useState(false);

    const handleEdit = () => {
      console.log("Edit");
    };
    const handleTrash = () => {
      console.log("Trash");
      setClickDelete(!clickDelete);
      setClicked(!clicked);
    };
    const handleConfirm = () => {
      console.log("Confirm");
    };
    const handleDelete = () => {
      console.log("Delete");
      setClickDelete(!clickDelete); //borrar
    };

    return (
      <View style={[styles.urlItem, clicked && styles.urlItemBackgroundFilled]}>
        <TouchableOpacity
          style={styles.urlItemContainer}
          onPress={() => {
            !clickDelete && setClicked(!clicked);
          }}
        >
          {clickDelete ? (
            <Image source={require("../../img/icons/trash.png")} />
          ) : clicked ? (
            <Image source={require("../../img/icons/radio-focused.png")} />
          ) : (
            <Image source={require("../../img/icons/radio-default.png")} />
          )}
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={[styles.notUrlEnvList, styles.urlItemContainerElem]}
          >
            {item}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            clickDelete ? handleConfirm() : handleEdit();
          }}
        >
          {clickDelete ? (
            <Image source={require("../../img/icons/confirm.png")} />
          ) : (
            <Image source={require("../../img/icons/edit.png")} />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            clickDelete ? handleDelete() : handleTrash();
          }}
        >
          {clickDelete ? (
            <Image source={require("../../img/icons/delete.png")} />
          ) : (
            <Image source={require("../../img/icons/trash.png")} />
          )}
        </TouchableOpacity>
      </View>
    );
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
            <FormContext.Provider
              value={{
                getRecordContext,
                onChangePicker: onChangeModalPicker,
                onChangeSelection: onChangePicker
              }}
            >
              <Text style={styles.languageText}>
                {locale.t("Settings:URL")}
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
            {!User?.token ? (
              <ButtonUI
                height={40}
                width={130}
                typeStyle="primary"
                onPress={showChangeURLModalFn}
                text={locale.t("Settings:NewLink")}
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
            <Dialog
              visible={showChangeURLModal}
              onDismiss={hideChangeURLModal}
              style={styles.dialogNewUrl}
            >
              <Dialog.Title
                style={{
                  fontSize: 25,
                  fontWeight: "700",
                  color: PRIMARY_100
                }}
              >
                {locale.t("Settings:AddNewURL")}
              </Dialog.Title>
              <Dialog.Content>
                <View style={{ marginTop: 16 }}>
                  <Text style={styles.urlEnvList}>
                    {locale.t("Settings:EnviromentURL")}
                  </Text>
                  <Input
                    // ref={inputRef}
                    typeField="textInput"
                    placeholder={locale.t("Settings:InputPlaceholder")}
                    value={valueEnvUrl}
                    onChangeText={(value) => setValueEnvUrl(value)}
                  />
                  <View style={{ height: 12 }} />
                  <ButtonUI
                    width="100%"
                    height={50}
                    typeStyle="secondary"
                    onPress={() => {
                      setCurrentAddUrl(valueEnvUrl);
                      addUrl();
                    }}
                    text={locale.t("Settings:NewLink")}
                  />
                </View>
                <View style={{ marginTop: 32 }}>
                  <Text style={styles.urlEnvList}>
                    {locale.t("Settings:EnviromentURL")}
                  </Text>
                  <ScrollView style={styles.listUrlItems}>
                    {storedDataUrl.length ? (
                      storedDataUrl.map((item, index) => {
                        return <UrlItem key={index} item={item} />;
                      })
                    ) : (
                      <Text style={styles.notUrlEnvList}>
                        {locale.t("Settings:NotEnviromentURL")}
                      </Text>
                    )}
                  </ScrollView>
                </View>
              </Dialog.Content>
            </Dialog>

            {/* <Dialog visible={showAddUrl}>
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
            </Dialog> */}
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
