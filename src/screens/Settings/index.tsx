//Imports
import React, { useEffect, useState, useCallback } from "react";
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
import ButtonUI from "etendo-ui-library/dist-native/components/button/Button";
import { isTablet } from "../../helpers/IsTablet";
import { BackIcon } from "etendo-ui-library/dist-native/assets/images/icons/BackIcon";
import { deviceStyles as styles } from "./deviceStyles";
import { PRIMARY_100 } from "../../styles/colors";
import Input from "etendo-ui-library/dist-native/components/input/Input";
import { UrlItem } from "../../components/UrlItem";
import { useAppSelector, useAppDispatch } from "../../../redux";
import {
  selectData,
  selectSelectedLanguage as selectSelectedLanguageRedux,
  selectSelectedUrl,
  selectStoredEnviromentsUrl,
  selectStoredLanguages,
  selectToken,
  setSelectedUrl
} from "../../../redux/user";
import { useUser } from "../../../hook/useUser";
import { changeLanguage } from "../../helpers/getLanguajes";
import { getLanguageName } from "../../i18n/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getClientName,
  getOrganizationName,
  getRoleName,
  getWarehouseName
} from "../../globals/getRoleInformation";

const Settings = (props) => {
  //Images
  const logoUri = "utility/ShowImageLogo?logo=yourcompanylogin";
  const notFoundLogo = require("../../../assets/unlink.png");
  const defaultLogo = require("../../../assets/your-company.png");
  //States
  const [url, setUrl] = useState<string>(null);
  const [modalUrl, setModalUrl] = useState<string>(null);
  const [showChangeURLModal, setShowChangeURLModal] = useState<boolean>(false);
  const [hasErrorLogo, setHasErrorLogo] = useState<boolean>(false);
  const [role, setRole] = useState<string>("");
  const [displayLanguage, setDisplayLanguage] = useState<string>(null);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [storedDataUrl, setStoredDataUrl] = useState([]);
  const [appVersion, setAppVersion] = useState<string>(version);
  const [valueEnvUrl, setValueEnvUrl] = useState<string>(null);
  const [debugUrl, setDebugUrl] = useState<string>("");

  const dispatch = useAppDispatch();
  const token = useAppSelector(selectToken);
  const languagesList = useAppSelector(selectStoredLanguages);
  const selectSelectedLanguage = useAppSelector(selectSelectedLanguageRedux);
  const storedEnviromentsUrl = useAppSelector(selectStoredEnviromentsUrl);
  const selectedUrl = useAppSelector(selectSelectedUrl);

  const {
    loadEnviromentsUrl,
    saveEnviromentsUrl,
    setCurrentLanguage
  } = useUser();

  useEffect(() => {
    const fetchUrlAndLogo = async () => {
      const tmpAppVersion = await getAppVersion(); // Note: getAppVersion should be a function in scope.
      if (storedEnviromentsUrl) {
        setStoredDataUrl(storedEnviromentsUrl);
      }
      const selectedUrlStored = await AsyncStorage.getItem("selectedUrl");
      setUrl(selectedUrl || selectedUrlStored);
      setAppVersion(tmpAppVersion);
      setModalUrl(url ? url.toString() : selectedUrl);
    };
    fetchUrlAndLogo();
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

  const onLogoError = () => {
    setHasErrorLogo(true);
  };

  const handleLanguage = async (label: string, value: string) => {
    await changeLanguage(value, setCurrentLanguage);
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
    await saveEnviromentsUrl([...storedDataUrl, currentValue]);
    setValueEnvUrl("");
    atChooseOption(currentValue);
    setIsUpdating(false);
  };

  const deleteUrl = async (item: string) => {
    const storedEnviromentsUrl = await loadEnviromentsUrl();
    let filteredItems = storedEnviromentsUrl.filter((url) => url !== item);
    await saveEnviromentsUrl(filteredItems);
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

  const atChooseOption = async (value: string) => {
    dispatch(setSelectedUrl(value));
    await AsyncStorage.setItem("selectedUrl", value);
    const tmpUrl = await setUrlOB(value);
    setUrl(tmpUrl);
    setModalUrl(value);
  };

  const handleOptionSelected = async ({ value }) => {
    await atChooseOption(value);
    setShowChangeURLModal(false);
  };

  // use redux
  const data = useAppSelector(selectData);

  // use effect to get role
  useEffect(() => {
    if (data) {
      Promise.all([getRoleName(data)])
        .then((values) => {
          const [role] = values;
          setRole(role);
        })
        .catch(function(error) {
          console.error(error);
        });
    }
  }, [data]);

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
            <Text style={styles.languageText}>{locale.t("Settings:URL")}</Text>
            <Input
              typeField="picker"
              placeholder={locale.t("Settings:InputPlaceholder")}
              value={url}
              onOptionSelected={(option: any) => {
                handleOptionSelected(option);
                setHasErrorLogo(false);
              }}
              disabled={!!token}
              displayKey="value"
              dataPicker={storedDataUrl.map((data) => ({ value: data }))}
              height={43}
              centerText={true}
              showOptionsAmount={6}
              placeholderSearch={locale.t("Settings:Search")}
            />
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
              value={
                displayLanguage
                  ? displayLanguage
                  : getLanguageName(selectSelectedLanguage)
              }
              onOptionSelected={(option: any) => {
                const { label, value } = option;
                handleLanguage(label, value);
              }}
              displayKey="label"
              dataPicker={languagesList}
              height={43}
              centerText={true}
            />
          </View>

          {!isTablet() && role === "System Administrator" && (
            <View style={styles.debugContainerStyles}>
              <Text style={styles.debugText}>
                {locale.t("Settings:DebugURL")}
              </Text>
              <Input
                typeField="textInput"
                placeholder={locale.t("Settings:DebugURLPlaceholder")}
                value={debugUrl}
                onChangeText={(value) => setDebugUrl(value)}
                height={43}
                centerText={true}
              />
              <ButtonUI
                height={40}
                width={90}
                typeStyle="primary"
                onPress={() => {}}
                text={locale.t("Settings:Save")}
              />
            </View>
          )}

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
                    {storedDataUrl?.length ? (
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

        {isTablet() && role === "System Administrator" && (
          <View style={styles.containerCardStyle}>
            <View style={styles.containerUrlStyle}>
              <Text style={styles.debugText}>
                {locale.t("Settings:DebugURL")}
              </Text>
              <Input
                typeField="textInput"
                placeholder={locale.t("Settings:DebugURLPlaceholder")}
                value={debugUrl}
                onChangeText={(value) => setDebugUrl(value)}
                height={43}
                centerText={true}
              />
              <ButtonUI
                height={40}
                width={90}
                typeStyle="primary"
                onPress={() => {}}
                text={locale.t("Settings:Save")}
              />
            </View>
            <View style={styles.logoContainerStyles} />
            <View style={styles.languageContainerStyles} />
          </View>
        )}
      </View>

      {isTablet() ? (
        <View style={styles.copyrightTablet}>
          <Text allowFontScaling={false}>
            {locale.t("Settings:AppVersion", { version: appVersion })}
          </Text>
          <Text allowFontScaling={false}>© Copyright Etendo 2020-2023</Text>
        </View>
      ) : null}
    </>
  );
};

export default withTheme(Settings);
