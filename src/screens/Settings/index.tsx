//Imports
import React, { useEffect, useState, useContext, useCallback } from "react";
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
import MainAppContext from "../../contexts/MainAppContext";
import ButtonUI from "etendo-ui-library/dist-native/components/button/Button";
import { isTablet } from "../../helpers/IsTablet";
import { BackIcon } from "etendo-ui-library/dist-native/assets/images/icons/BackIcon";
import { deviceStyles as styles } from "./deviceStyles";
import { ContainerContext } from "../../contexts/ContainerContext";
import { SET_URL } from "../../contexts/actionsTypes";
import { PRIMARY_100 } from "../../styles/colors";
import Input from "etendo-ui-library/dist-native/components/input/Input";
import { ISelectPicker } from "../../interfaces";
import { UrlItem } from "../../components/UrlItem";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { useAppSelector } from "../../../redux";
import {
  selectData,
  selectSelectedLanguage,
  selectToken,
  selectUser
} from "../../../redux/user";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUser } from "../../../hook/useUser";

const Settings = (props) => {
  //Images
  const logoUri = "utility/ShowImageLogo?logo=yourcompanylogin";
  const notFoundLogo = require("../../../assets/unlink.png");
  const defaultLogo = require("../../../assets/your-company.png");
  //Context
  const mainAppContext = useContext(MainAppContext);
  //States
  const [url, setUrl] = useState<string>(null);
  const [modalUrl, setModalUrl] = useState<string>(null);
  const [showChangeURLModal, setShowChangeURLModal] = useState<boolean>(false);
  const [hasErrorLogo, setHasErrorLogo] = useState<boolean>(false);

  const [displayLanguage, setDisplayLanguage] = useState<string>(null);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [storedDataUrl, setStoredDataUrl] = useState([]);
  const [appVersion, setAppVersion] = useState<string>(version);
  const [valueEnvUrl, setValueEnvUrl] = useState<string>(null);
  const { dispatch } = useContext(ContainerContext);
  const token = useAppSelector(selectToken);
  const userRedux = useAppSelector(selectUser);
  const languageRedux = useAppSelector(selectSelectedLanguage);
  const dataRedux = useAppSelector(selectData);

  const { loadEnviromentsUrl, saveEnviromentsUrl } = useUser();

  useEffect(() => {
    const fetchUrlAndLogo = async () => {
      const tmpUrl = await getUrl();
      const tmpAppVersion = await getAppVersion(); // Note: getAppVersion should be a function in scope.
      let storedEnviromentsUrl = await loadEnviromentsUrl();

      if (storedEnviromentsUrl) {
        setStoredDataUrl(storedEnviromentsUrl);
      }
      setUrl(tmpUrl);
      setAppVersion(tmpAppVersion);
      setModalUrl(url ? url.toString() : tmpUrl);
    };
    fetchUrlAndLogo();
    console.log("tokenRedux", token);
    console.log("userRedux", userRedux);
    console.log("languageRedux", languageRedux);
    console.log("dataRedux", dataRedux);
  }, []);

  const loadServerLogo = (url: string) => {
    return url ? { uri: url + logoUri } : defaultLogo;
  };

  const showChangeURLModalFn = () => {
    if (!token) {
      setShowChangeURLModal(true);
    }
  };

  const hideChangeURLModal = () => {
    setShowChangeURLModal(false);
    setModalUrl(url);
  };

  const changeURL = async () => {
    if (!modalUrl || modalUrl == "") return;
    await saveEnviromentsUrl(storedDataUrl);
    const tmpUrl = await setUrlOB(modalUrl);
    const tmpLogo = loadServerLogo(url);

    setShowChangeURLModal(false);
    setModalUrl(url);
    setUrl(tmpUrl);
    setLogo(tmpLogo);
    dispatch({ type: SET_URL, url: tmpUrl });
  };

  const onLogoError = () => {
    setHasErrorLogo(true);
  };

  const handleLanguage = (label: string, value: string) => {
    const { changeLanguage } = mainAppContext;
    changeLanguage(value);
    setDisplayLanguage(label);
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

  const setEnv = useCallback((value: any) => {
    setValueEnvUrl(value);
  }, []);

  const { languages } = mainAppContext;

  const handleOptionSelected = async ({ value }: ISelectPicker) => {
    await User.saveEnviromentsUrl(storedDataUrl);
    const tmpUrl = await setUrlOB(value);
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
              token ? handleBackButtonPress : handleBackButtonPressWithLogin
            }
          />
        </View>
        <View style={styles.containerCardStyle}>
          <View style={styles.containerUrlStyle}>
            <View style={styles.urlTextsContainer}>
              <Text style={styles.urlTitle}>{locale.t("Settings:URL")}</Text>
              <Text style={styles.urlDescription}>{url}</Text>
            </View>
            {!token ? (
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
            <Text style={styles.languageText}>
              {locale.t("Settings:Language")}
            </Text>
            <Input
              typeField="picker"
              placeholder={locale.t("Settings:Language")}
              value={displayLanguage}
              onOptionSelected={(option: any) => {
                const { label, value } = option;
                handleLanguage(label, value);
              }}
            >
              <Text style={styles.languageText}>
                {locale.t("Settings:Language")}
              </Text>
              {/* 
              TO-DO: Delete PickerList and components related to it
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
              /> */}
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
                <View>
                  <Text style={styles.urlEnvList}>
                    {locale.t("Settings:EnviromentURL")}
                  </Text>
                  <Input
                    typeField="textInput"
                    placeholder={locale.t("Settings:InputPlaceholder")}
                    value={valueEnvUrl}
                    onChangeText={setEnv}
                    height={50}
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
                        return (
                          <UrlItem
                            key={index}
                            item={item}
                            setValueEnvUrl={setValueEnvUrl}
                            deleteUrl={deleteUrl}
                            setIsUpdating={setIsUpdating}
                            modalUrl={modalUrl}
                            url={url}
                            setUrl={setUrl}
                            resetLocalUrl={resetLocalUrl}
                            handleOptionSelected={handleOptionSelected}
                          />
                        );
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
