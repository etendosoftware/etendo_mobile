//Imports
import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  ScrollView,
  Image,
  Text,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  Keyboard
} from "react-native";
import locale from "../../i18n/locale";
import { withTheme, Dialog } from "react-native-paper";
import {
  setUrl as setUrlOB,
  formatUrl,
  resetLocalUrl,
  formatEnvironmentUrl
} from "../../ob-api/ob";
import { version } from "../../../package.json";
import ButtonUI from "etendo-ui-library/dist-native/components/button/Button";
import { isTablet } from "../../helpers/IsTablet";
import { BackIcon } from "etendo-ui-library/dist-native/assets/images/icons/BackIcon";
import { MoreIcon } from "etendo-ui-library/dist-native/assets/images/icons/MoreIcon";
import { deviceStyles as styles } from "./deviceStyles";
import { PRIMARY_100 } from "../../styles/colors";
import Input from "etendo-ui-library/dist-native/components/input/Input";
import { UrlItem } from "../../components/UrlItem";
import { useAppSelector, useAppDispatch } from "../../../redux";
import {
  selectContextPathUrl,
  selectData,
  selectDevUrl,
  selectSelectedEnvironmentUrl,
  selectSelectedLanguage as selectSelectedLanguageRedux,
  selectSelectedUrl,
  selectStoredEnviromentsUrl,
  selectStoredLanguages,
  selectToken,
  setContextPathUrl,
  setDevUrl,
  setSelectedEnvironmentUrl,
  setSelectedUrl
} from "../../../redux/user";
import { useUser } from "../../../hook/useUser";
import { changeLanguage } from "../../helpers/getLanguajes";
import { getLanguageName } from "../../i18n/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { References } from "../../constants/References";
import { selectIsDemo } from "../../../redux/window";
import { useEtrest } from "../../../hook/useEtrest";
import { Toast } from "../../utils/Toast";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const Settings = (props) => {
  // Declare a variable 'listViewRef' that will hold a reference to the KeyboardAwareScrollView component
  let listViewRef: KeyboardAwareScrollView;

  //Images
  const logoUri = "utility/ShowImageLogo?logo=yourcompanylogin";
  const notFoundLogo = require("../../../assets/unlink.png");
  const defaultLogo = require("../../../assets/your-company.png");

  // use redux
  const dispatch = useAppDispatch();
  const token = useAppSelector(selectToken);
  const languagesList = useAppSelector(selectStoredLanguages);
  const selectSelectedLanguage = useAppSelector(selectSelectedLanguageRedux);
  const storedEnviromentsUrl = useAppSelector(selectStoredEnviromentsUrl);
  const selectedUrl = useAppSelector(selectSelectedUrl);
  const selectedEnvironmentUrl = useAppSelector(selectSelectedEnvironmentUrl);
  const contextPathUrl = useAppSelector(selectContextPathUrl);
  const devUrl = useAppSelector(selectDevUrl);
  const isDemoTry = useAppSelector(selectIsDemo);
  const data = useAppSelector(selectData);

  const { getRoleName } = useEtrest(selectedUrl, token);
  // local states
  const [url, setUrl] = useState<string>("");
  const [modalUrl, setModalUrl] = useState<string>("");
  const [showChangeURLModal, setShowChangeURLModal] = useState<boolean>(false);
  const [hasErrorLogo, setHasErrorLogo] = useState<boolean>(false);
  const [role, setRole] = useState<string>("");
  const [displayLanguage, setDisplayLanguage] = useState<string>(null);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [storedDataUrl, setStoredDataUrl] = useState([]);
  const [appVersion, setAppVersion] = useState<string>(version);
  const [valueEnvUrl, setValueEnvUrl] = useState<string>(null);
  const [logoURI, setLogoURI] = useState(defaultLogo);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  const {
    loadEnviromentsUrl,
    saveEnviromentsUrl,
    setCurrentLanguage
  } = useUser();

  useEffect(() => {
    const fetchUrlAndLogo = async () => {
      const tmpAppVersion = await getAppVersion(); // Note: getAppVersion should be a function in scope.
      if (storedEnviromentsUrl.length > 0) {
        setStoredDataUrl(storedEnviromentsUrl);
        const selectedUrlStored = await AsyncStorage.getItem("selectedUrl");
        setUrl(selectedUrl || selectedUrlStored);
        setAppVersion(tmpAppVersion);
        setModalUrl(url ? url.toString() : selectedUrl);
      } else {
        await AsyncStorage.removeItem("selectedUrl");
      }
    };
    fetchUrlAndLogo();
  }, [hasErrorLogo]);

  const showChangeURLModalFn = () => {
    if (!token) {
      setShowChangeURLModal(true);
    }
  };

  const hideChangeURLModal = () => {
    if (isKeyboardVisible) {
      Keyboard.dismiss();
    } else {
      setShowChangeURLModal(false);
      setModalUrl(url);
    }
  };

  const handleLanguage = async (label: string, value: string) => {
    await changeLanguage(value, setCurrentLanguage(value));
    setDisplayLanguage(label);
  };

  const addUrl = async () => {
    const formattedUrl = formatUrl(valueEnvUrl);
    const newUrl = formattedUrl + contextPathUrl;

    if (!formattedUrl || storedDataUrl.includes(newUrl)) {
      return;
    }

    const newStoredDataUrl = [...storedDataUrl, newUrl];

    setStoredDataUrl(newStoredDataUrl);
    await saveEnviromentsUrl([...storedDataUrl, newUrl]);

    setValueEnvUrl("");
    setSelectedUrl(newUrl);
    atChooseOption(newUrl);

    setIsUpdating(false);
  };

  const deleteUrl = async (item: string) => {
    const storedEnviromentsUrl = await loadEnviromentsUrl();
    let filteredItems = storedEnviromentsUrl.filter((url) => url !== item);
    await saveEnviromentsUrl(filteredItems);
    setStoredDataUrl(filteredItems);
    if (selectedUrl == item) {
      dispatch(setSelectedUrl(null));
      await AsyncStorage.removeItem("selectedUrl");
    }
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

  // This function is responsible for setting the logo URI based on the current URL
  const updateLogoURI = useCallback((currentUrl) => {
    if (!currentUrl) {
      setLogoURI(defaultLogo);
      return;
    }
    const fullLogoURI = `${currentUrl}/${logoUri}`;
    Image.prefetch(fullLogoURI).then(
      () => {
        setHasErrorLogo(false);
        setLogoURI({ uri: fullLogoURI });
      },
      () => {
        setHasErrorLogo(true);
        setLogoURI(notFoundLogo);
      }
    );
  }, []);

  useEffect(() => {
    updateLogoURI(url);
  }, [url, updateLogoURI]);

  const LogoImage = () => {
    return (
      <Image
        style={styles.logoImageStyles}
        source={hasErrorLogo ? notFoundLogo : logoURI}
        onError={() => setHasErrorLogo(true)}
        height={100}
        width={200}
      />
    );
  };

  useEffect(() => {
    setHasErrorLogo(false);
  }, [url]);

  const atChooseOption = async (value: string) => {
    // Concatenates the base server URL with the context path to form the full endpoint URL
    const fullUrl = value;

    await AsyncStorage.setItem("selectedUrl", fullUrl);
    await AsyncStorage.setItem(
      "selectedEnvironmentUrl",
      formatEnvironmentUrl(fullUrl)
    );
    dispatch(setSelectedUrl(fullUrl));
    const tmpUrl = await setUrlOB(fullUrl);
    setUrl(tmpUrl);
    setModalUrl(tmpUrl);
  };

  useEffect(() => {
    const formattedUrl = formatEnvironmentUrl(selectedUrl);
    dispatch(setSelectedEnvironmentUrl(formattedUrl));
  }, [selectedUrl]);

  const handleOptionSelected = async ({ value }) => {
    await atChooseOption(value);
    setShowChangeURLModal(false);
  };

  useEffect(() => {
    if (data?.roleId && token) {
      Promise.all([getRoleName(data)])
        .then((values) => {
          const [role] = values;
          setRole(role);
        })
        .catch(function(error) {
          console.error(error);
        });
    }
  }, [data, token]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        if (!isKeyboardVisible) setIsKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        if (isKeyboardVisible) setIsKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, [isKeyboardVisible]);

  const saveDebugURL = async () => {
    await AsyncStorage.setItem("debugURL", devUrl);
    dispatch(setDevUrl(devUrl));
    Toast("Settings:DebugURLSaved", { type: "success" });
  };

  return (
    <KeyboardAwareScrollView
      style={styles.fullContainer}
      ref={(ref: KeyboardAwareScrollView) => {
        listViewRef = ref;
      }}
      keyboardShouldPersistTaps="handled"
      extraScrollHeight={150}
      enableOnAndroid={true}
    >
      <View style={styles.container}>
        <View style={styles.backContainer}>
          <Text style={styles.settingsTitle}>{locale.t("Settings")}</Text>
          <ButtonUI
            iconLeft={<BackIcon style={styles.backIcon} />}
            height={40}
            paddingVertical={0}
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
              value={
                isDemoTry
                  ? References.DemoUrl
                  : storedEnviromentsUrl.length == 1 && url
                  ? storedEnviromentsUrl[0]
                  : storedEnviromentsUrl.length > 1
                  ? url
                  : null
              }
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
              <View style={styles.containerAddLinkStyle}>
                <ButtonUI
                  typeStyle="primary"
                  onPress={showChangeURLModalFn}
                  text={locale.t("Settings:NewLink")}
                  iconRight={<MoreIcon />}
                />
              </View>
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

          {!isTablet() && role === References.SystemAdministrator && (
            <View style={styles.debugContainerStyles}>
              <Text style={styles.debugText}>
                {locale.t("Settings:DebugURL")}
              </Text>
              <Input
                typeField="textInput"
                placeholder={locale.t("Settings:DebugURLPlaceholder")}
                value={devUrl}
                onChangeText={(value) => dispatch(setDevUrl(value))}
                height={50}
              />
              <View style={styles.saveButtonContainer}>
                <ButtonUI
                  typeStyle="primary"
                  onPress={saveDebugURL}
                  text={locale.t("Settings:Save")}
                />
              </View>
            </View>
          )}

          <Modal visible={showChangeURLModal} transparent>
            <TouchableWithoutFeedback onPress={hideChangeURLModal}>
              <View style={{ flex: 1 }}>
                <Dialog
                  visible={showChangeURLModal}
                  onDismiss={() => setShowChangeURLModal(false)}
                  style={styles.dialogNewUrl}
                >
                  <View style={styles.containerClose}>
                    <TouchableOpacity
                      activeOpacity={0.2}
                      style={styles.buttonClose}
                      onPress={() => setShowChangeURLModal(false)}
                    >
                      <Image
                        source={require("../../../assets/icons/close.png")}
                      />
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

                  <Dialog.Content style={{ flex: 1 }}>
                    <View>
                      <Text style={styles.urlEnvList}>
                        {locale.t("Settings:EnviromentURL")}
                      </Text>
                      <Input
                        typeField={"textInput"}
                        placeholder={locale.t("Settings:InputPlaceholder")}
                        value={valueEnvUrl}
                        onChangeText={(valueEnvUrl) => {
                          setValueEnvUrl(valueEnvUrl);
                        }}
                        height={50}
                      />
                    </View>

                    <View>
                      <Text style={styles.urlContextPath}>
                        {locale.t("Settings:ContextPath")}
                      </Text>
                      <Input
                        typeField="textInput"
                        placeholder={locale.t(
                          "Settings:ContextPathPlaceholder"
                        )}
                        value={contextPathUrl}
                        onChangeText={(value) =>
                          dispatch(setContextPathUrl(value))
                        }
                        height={50}
                      />

                      <View style={{ marginTop: 10 }}>
                        <ButtonUI
                          width="100%"
                          height={50}
                          typeStyle="secondary"
                          onPress={() => {
                            Keyboard.dismiss();
                            addUrl();
                          }}
                          iconRight={<MoreIcon />}
                          text={
                            isUpdating
                              ? locale.t("Settings:UpdateLink")
                              : locale.t("Settings:NewLink")
                          }
                        />
                      </View>
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
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </View>

        {isTablet() && role === References.SystemAdministrator && (
          <View style={styles.containerCardStyle}>
            <View style={styles.containerUrlStyle}>
              <Text style={styles.debugText}>
                {locale.t("Settings:DebugURL")}
              </Text>
              <Input
                typeField="textInput"
                placeholder={locale.t("Settings:DebugURLPlaceholder")}
                value={devUrl}
                onChangeText={(value) => dispatch(setDevUrl(value))}
                height={50}
              />
              <View style={styles.saveButtonContainer}>
                <ButtonUI
                  typeStyle="primary"
                  onPress={saveDebugURL}
                  text={locale.t("Settings:Save")}
                />
              </View>
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
    </KeyboardAwareScrollView>
  );
};

export default withTheme(Settings);
