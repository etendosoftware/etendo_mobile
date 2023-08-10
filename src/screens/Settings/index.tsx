//Imports
import React, { useEffect, useState, useContext, useCallback } from "react";
import PickerList from "../../components/List";
import { View, ScrollView, Image, Text, TouchableOpacity } from "react-native";
import locale from "../../i18n/locale";
import { withTheme, Dialog, Portal } from "react-native-paper";
import {
  setUrl as setUrlOB,
  getUrl,
  formatUrl,
  resetLocalUrl
} from "../../ob-api/ob";
import { version } from "../../../package.json";
import { User } from "../../stores";
import MainAppContext from "../../contexts/MainAppContext";
import FormContext from "../../contexts/FormContext";
import { IField } from "../../components/Field";
import ButtonUI from "etendo-ui-library/dist-native/components/button/Button";
import { isTablet } from "../../helpers/IsTablet";
import { BackIcon } from "etendo-ui-library/dist-native/assets/images/icons/BackIcon";
import { deviceStyles as styles } from "./deviceStyles";
import { ContainerContext } from "../../contexts/ContainerContext";
import { SET_URL } from "../../contexts/actionsTypes";
import { PRIMARY_100 } from "../../styles/colors";
import Input from "etendo-ui-library/dist-native/components/input/Input";
import { ISelectPicker } from "../../interfaces";

const Settings = (props) => {
  //Images
  const logoUri = "utility/ShowImageLogo?logo=yourcompanylogin";
  const notFoundLogo = require("../../../assets/unlink.png");
  const defaultLogo = require("../../../assets/your-company.png");
  //Context
  const mainAppContext = useContext(MainAppContext);
  const { getRecordContext } = useContext(FormContext);
  //States
  const [url, setUrl] = useState<string>(null);
  const [modalUrl, setModalUrl] = useState<string>(null);
  const [showChangeURLModal, setShowChangeURLModal] = useState<boolean>(false);
  const [hasErrorLogo, setHasErrorLogo] = useState<boolean>(false);

  const [selectedLanguage, setSelectedLanguage] = useState<string>(null);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [storedDataUrl, setStoredDataUrl] = useState([]);
  const [appVersion, setAppVersion] = useState<string>(version);
  const [valueEnvUrl, setValueEnvUrl] = useState<string>(null);
  const { dispatch } = useContext(ContainerContext);

  useEffect(() => {
    const fetchUrlAndLogo = async () => {
      const tmpUrl = await getUrl();
      const tmpAppVersion = await getAppVersion(); // Note: getAppVersion should be a function in scope.
      let storedEnviromentsUrl = await User.loadEnviromentsUrl();
      if (storedEnviromentsUrl) {
        setStoredDataUrl(storedEnviromentsUrl);
      }
      setUrl(tmpUrl);
      setAppVersion(tmpAppVersion);
      setModalUrl(url ? url.toString() : tmpUrl);
    };
    fetchUrlAndLogo();
  }, []);

  const loadServerLogo = (url: string) => {
    return url ? { uri: url + logoUri } : defaultLogo;
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

  const onLogoError = () => {
    setHasErrorLogo(true);
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
    let currentValue = valueEnvUrl;
    if (
      !currentValue ||
      currentValue == "" ||
      storedDataUrl.some((url) => url == formatUrl(valueEnvUrl))
    )
      return;
    currentValue = formatUrl(currentValue);
    setStoredDataUrl([...storedDataUrl, currentValue]);
    await User.saveEnviromentsUrl([...storedDataUrl, currentValue]);
    setValueEnvUrl("");
    setIsUpdating(false);
  };

  const deleteUrl = async (item: string) => {
    const storedEnviromentsUrl = await User.loadEnviromentsUrl();
    let filteredItems = storedEnviromentsUrl.filter((url) => url !== item);
    await User.saveEnviromentsUrl(filteredItems);
    setStoredDataUrl(filteredItems);
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

  const LogoImage = () => {
    return (
      <Image
        style={styles.logoImageStyles}
        source={hasErrorLogo ? notFoundLogo : loadServerLogo(url)}
        onError={onLogoError}
        height={100}
        width={200}
      />
    );
  };

  useEffect(() => {
    setHasErrorLogo(false);
  }, [url]);

  const UrlItem = useCallback(({ item }) => {
    const [clicked, setClicked] = useState(false);
    const [clickDelete, setClickDelete] = useState(false);

    const handleEdit = () => {
      setValueEnvUrl(item);
      deleteUrl(item);
      setIsUpdating(true);
    };

    const handleTrash = () => {
      setClickDelete(!clickDelete);
      setClicked(!clicked);
    };

    const handleConfirm = async () => {
      deleteUrl(item);
      setClickDelete(false);
      setClicked(false);
      if (!url || !modalUrl) {
        setUrl(null);
        resetLocalUrl();
      }
    };

    const handleDelete = () => {
      setClickDelete(!clickDelete);
      setClicked(false);
    };

    return (
      <View style={[styles.urlItem, clicked && styles.urlItemBackgroundFilled]}>
        <TouchableOpacity
          style={styles.urlItemContainer}
          onPress={() => {
            !clickDelete && setClicked(!clicked);
            handleOptionSelected({ value: item });
          }}
        >
          {clickDelete ? (
            <Image
              style={styles.iconImage}
              source={require("../../../assets/icons/trash.png")}
            />
          ) : clicked ? (
            <Image
              style={styles.iconImage}
              source={require("../../../assets/icons/radio-focused.png")}
            />
          ) : (
            <Image
              style={styles.iconImage}
              source={require("../../../assets/icons/radio-default.png")}
            />
          )}
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={[styles.urlListed, styles.urlItemContainerElem]}
          >
            {item}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            clickDelete ? handleConfirm() : handleEdit();
          }}
          style={styles.actionIcon}
        >
          {clickDelete ? (
            <Image
              style={styles.iconImage}
              source={require("../../../assets/icons/confirm.png")}
            />
          ) : (
            <Image
              style={styles.iconImage}
              source={require("../../../assets/icons/edit.png")}
            />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            clickDelete ? handleDelete() : handleTrash();
          }}
          style={styles.actionIcon}
        >
          {clickDelete ? (
            <Image
              style={styles.iconImage}
              source={require("../../../assets/icons/delete.png")}
            />
          ) : (
            <Image
              style={styles.iconImage}
              source={require("../../../assets/icons/trash.png")}
            />
          )}
        </TouchableOpacity>
      </View>
    );
  }, []);

  const setEnv = useCallback((value: any) => {
    setValueEnvUrl(value);
  }, []);

  const { languages } = mainAppContext;

  const handleOptionSelected = async ({ value }: ISelectPicker) => {
    await User.saveEnviromentsUrl(storedDataUrl);
    const tmpUrl = await setUrlOB(value);
    const tmpLogo = loadServerLogo(value);
    setShowChangeURLModal(false);
    setModalUrl(value);
    setUrl(tmpUrl);
    dispatch({ type: SET_URL, url: tmpUrl });
  };

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
              <Input
                typeField="picker"
                placeholder={locale.t("Settings:InputPlaceholder")}
                value={url}
                onOptionSelected={(option: ISelectPicker) => {
                  handleOptionSelected(option);
                  setHasErrorLogo(false);
                }}
                displayKey="value"
                dataPicker={storedDataUrl.map((data) => ({ value: data }))}
                height={43}
                centerText={true}
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
            <View style={styles.findingImageContainer}>
              <LogoImage />
              {hasErrorLogo && (
                <View>
                  <Text style={styles.logoTitleStyles}>
                    {locale.t("Settings:ImageNotFound")}
                  </Text>
                  <Text style={styles.logoSubTitle}>
                    {locale.t("Settings:ImageNotFoundServer")}
                  </Text>
                </View>
              )}
            </View>
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
              <View style={styles.containerClose}>
                <TouchableOpacity
                  activeOpacity={0.2}
                  style={styles.buttonClose}
                  onPress={() => setShowChangeURLModal(false)}
                >
                  <Image source={require("../../../assets/icons/close.png")} />
                </TouchableOpacity>
              </View>

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
                <View
                  style={{
                    marginTop: 16
                  }}
                >
                  <Text style={styles.urlEnvList}>
                    {locale.t("Settings:EnviromentURL")}
                  </Text>
                  <Input
                    typeField="textInput"
                    placeholder={locale.t("Settings:InputPlaceholder")}
                    value={valueEnvUrl}
                    onChangeText={setEnv}
                    height={45}
                  />
                  <View style={{ height: 12 }} />
                  <ButtonUI
                    width="100%"
                    height={50}
                    typeStyle="secondary"
                    onPress={() => {
                      addUrl();
                    }}
                    text={
                      isUpdating
                        ? locale.t("Settings:UpdateLink")
                        : locale.t("Settings:NewLink")
                    }
                  />
                </View>
                <View style={{ marginTop: 32 }}>
                  <Text style={styles.urlEnvList}>
                    {locale.t("ShowLoadUrl:ItemList")}
                  </Text>
                  <ScrollView
                    style={styles.listUrlItems}
                    persistentScrollbar={true}
                    showsVerticalScrollIndicator={true}
                  >
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
