import React, { useEffect, useState, useContext } from "react";
import PickerList from "../../components/List";
import {
  View,
  ScrollView,
  Image,
  TextInput,
  Dimensions,
  TouchableOpacity
} from "react-native";
import locale from "../../i18n/locale";
import {
  Appbar,
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
import { observer } from "mobx-react";
import { Snackbar } from "../../globals";
import MainAppContext from "../../contexts/MainAppContext";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { defaultTheme } from "../../themes";
import FormContext from "../../contexts/FormContext";
import { IField } from "../../components/Field";
import { Picker } from "@react-native-picker/picker";

import styles from "./styles";
const logoUri = "utility/ShowImageLogo?logo=yourcompanylogin";
const defaultLogoUri = "../../../assets/logo.png";
const win = Dimensions.get("window");

const Settings = observer((props) => {
  const mainAppContext = useContext(MainAppContext);
  const { getRecordContext } = useContext(FormContext);

  const [url, setUrl] = useState<string>(null);
  const [modalUrl, setModalUrl] = useState<string>(null);
  const [showChangeURLModal, setShowChangeURLModal] = useState<boolean>(false);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState<boolean>(
    false
  );
  const [logo, setLogo] = useState<string>(null);
  const [defaultLogo, setDefaultLogo] = useState<string>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>(null);
  const [showAddUrl, setShowAddUrl] = useState<boolean>(false);
  const [currentAddUrl, setCurrentAddUrl] = useState<string>("");
  const [storedDataUrl, setStoredDataUrl] = useState<any[]>([]);
  const [appVersion, setAppVersion] = useState<string>(version);

  useEffect(() => {
    const fetchUrlAndLogo = async () => {
      const tmpUrl = await getUrl();
      const tmpLogo = loadServerLogo(url); // Note: loadServerLogo should be a function in scope.
      const tmpDefaultLogo = require(defaultLogoUri);
      const tmpAppVersion = await getAppVersion(); // Note: getAppVersion should be a function in scope.

      let storedEnviromentsUrl = await User.loadEnviromentsUrl();

      if (storedEnviromentsUrl) {
        setStoredDataUrl([...storedDataUrl, storedEnviromentsUrl]);
      }
      setDefaultLogo(tmpDefaultLogo);
      setLogo(tmpLogo);
      setUrl(tmpUrl);
      setAppVersion(tmpAppVersion);
      setModalUrl(url.toString());
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
    if (User.token) {
      showLogoutConfirmationFn();
    } else {
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
  };

  const showLogoutConfirmationFn = () => {
    setShowLogoutConfirmation(true);
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
    setCurrentAddUrl("");
  };

  const renderUrlItems = (items) => {
    if (items.length !== 0) {
      return items.map((item) => {
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

  const getAppVersion = async () => {
    const metadata = null;

    if (!metadata) {
      return version;
    }

    return `${metadata.appVersion} - ${metadata.label}`;
  };

  const { languages } = mainAppContext; 
  return (
    <View style={{ flex: 1, backgroundColor: defaultTheme.colors.background }}>
      <Appbar.Header dark={true}>
        {!User.token && (
          <Appbar.BackAction
            onPress={() => props.navigation.navigate("Login")}
          />
        )}
        {User.token && (
          <Appbar.Action
            icon="menu"
            onPress={() => props.navigation.toggleDrawer()}
          />
        )}
        <Appbar.Content title={locale.t("Settings:Title")} />
      </Appbar.Header>
      <List.Section
        titleStyle={{ fontSize: 20 }}
        style={{ width: "90%", alignSelf: "center" }}
      >
        <List.Item
          title={locale.t("Settings:URL")}
          titleStyle={{ fontSize: 15, fontWeight: "bold" }}
          description={url}
          descriptionStyle={{ paddingTop: 16 }}
          descriptionNumberOfLines={1}
          style={{ marginTop: 10 }}
        />
        {!User.token ? (
          <>
            <Button
              style={{ width: 150, alignSelf: "flex-end", marginBottom: 15 }}
              mode="text"
              onPress={showChangeURLModalFn}
            >
              {locale.t("Settings:ChangeURL")}
            </Button>
          </>
        ) : (
          <Text allowFontScaling={false} style={{ marginLeft: 15 }}>
            {locale.t("Settings:ChangeURLLogoutConfirmation")}
          </Text>
        )}
        <List.Item
          title={locale.t("Settings:Logo")}
          style={{ marginTop: 10 }}
          titleStyle={{ fontSize: 15, fontWeight: "bold" }}
        />
        <Image
          resizeMode="contain"
          style={{ height: 80 }}
          defaultSource={defaultLogo}
          source={logo}
          onError={onLogoError}
        />
        <View style={{ marginTop: 10 }}>
          <FormContext.Provider
            value={{
              getRecordContext,
              onChangePicker: onChangeModalPicker,
              onChangeSelection: onChangePicker
            }}
          >
            <PickerList
              pickerItems={languages}
              fieldStyle={{ padding: 16 }}
              field={{
                id: "Language Field",
                name: locale.t("Settings:Language"),
                readOnly: false,
                column: { updatable: true },
                columnName: null
              }}
              value={
                selectedLanguage ? selectedLanguage : mainAppContext.selectedLanguage
              }
            ></PickerList>
          </FormContext.Provider>
        </View>
        <Text
          allowFontScaling={false}
          style={{ paddingTop: 5, marginLeft: 35, marginBottom: 5 }}
        >
          {" "}
          {locale.t("Settings:AppVersion", { version: appVersion })}{" "}
        </Text>
      </List.Section>

      <Image
        style={styles.image}
        resizeMode={"cover"}
        source={require("../../img/settings-profile.png")}
        height={win.height}
      />
      <Portal>
        <Dialog visible={showChangeURLModal} onDismiss={hideChangeURLModal}>
          <Dialog.Title>{locale.t("Settings:ChangeServerURL")}</Dialog.Title>
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
              mode="outlined"
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
              <ScrollView>
                {renderUrlItems(storedDataUrl)}
              </ScrollView>
            </View>
          </Dialog.Content>
        </Dialog>
      </Portal>
    </View>
  );
});

export default withTheme(Settings);
