import React, { useEffect, useRef } from "react";
import { Image, View, Text, ImageBackground, ScrollView, Platform, Linking, AppState } from "react-native";
import locale from "../../i18n/locale";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Etendo } from "../../helpers/Etendo";
import styles from "./styles";
import { INavigation } from "../../interfaces";
import { isTablet } from "../../../hook/isTablet";
import { deviceStyles } from "./deviceStyles";
import CardDropdown from "etendo-ui-library/dist-native/components/cards/components/cardDropdown/CardDropdown";
import { StarIcon } from "etendo-ui-library/dist-native/assets/images/icons/StarIcon";
import { isTabletSmall } from "../../helpers/IsTablet";
import LoadingHome from "../../components/LoadingHome";
import {
  selectData,
  selectSelectedLanguage,
  selectSelectedUrl,
  selectToken,
  setContextPathUrl,
  setSelectedEnvironmentUrl
} from "../../../redux/user";
import { useAppDispatch, useAppSelector } from "../../../redux";
import {
  selectLoading,
  selectMenuItems,
  setIsSubapp,
} from "../../../redux/window";
import { OBRest } from "etrest";
import { formatEnvironmentUrl } from "../../ob-api/ob";
import { generateUniqueId, getContextPath } from "../../utils";
import { References } from "../../constants/References";
import DefaultPreference from "react-native-default-preference";
import { setSharedFiles } from "../../../redux/shared-files-reducer";

// Local Assets
const etendoBoyImg = require("../../../assets/etendo-bk-tablet.png");
const etendoBoyImgSmall = require("../../../assets/etendo-bk-tablet-small.png");
const etendoBoyMobile = require("../../../assets/etendo-bk-mobile.png");
const background = require("../../../assets/background.png");
const backgroundMobile = require("../../../assets/background-mobile.png");

// App Group Identifiers
const AppGroupIdentifierIos = "group.com.etendoapploader.ios";
const AppGroupIdentifierAndroid = "group.com.etendoapploader.android";

interface Props {
  navigation: INavigation;
  appMinCoreVersion: string;
  coreVersion: string;
}

const HomeComponent = (props: Props) => {
  const data = useAppSelector(selectData);
  const loading = useAppSelector(selectLoading);
  const menuItems = useAppSelector(selectMenuItems);
  const token = useAppSelector(selectToken);
  const selectedUrl = useAppSelector(selectSelectedUrl);
  const dispatch = useAppDispatch();

  // On mount, set the AppGroup identifier based on the platform
  useEffect(() => {
    if (Platform.OS === "ios") {
      DefaultPreference.setName(AppGroupIdentifierIos);
    } else {
      DefaultPreference.setName(AppGroupIdentifierAndroid);
    }
    saveTokenAndURL(token, selectedUrl);
  }, []);

  // Initialize OBRest with token and URL (if available)
  useEffect(() => {
    const initializeOBRest = () => {
      const url = selectedUrl ? new URL(selectedUrl) : new URL(References.DemoUrl);
      OBRest.init(url, token);
      OBRest.loginWithToken(token);
    };

    if (token) {
      initializeOBRest();
    }
  }, [selectedUrl, token]);

  // Save token and URL to DefaultPreference whenever they change
  const saveTokenAndURL = async (tokenValue: string, urlValue: string) => {
    try {
      await DefaultPreference.set("token", tokenValue);
      await DefaultPreference.set("urlToFetchSubApps", urlValue);
    } catch (error) {
      console.error("Error saving token/URL:", error);
    }
  };

  // Utility to add 'file://' prefix if missing
  const addFilePrefixIfNeeded = (path: string) => {
    return path.startsWith("file://") ? path : `file://${path}`;
  };

  const loadSharedFileData = async () => {
    try {
      const filesJson = await DefaultPreference.get("sharedFiles");
      const selectedSubApplication = await DefaultPreference.get("selectedSubApplication");

      if (filesJson) {
        const filesArray = JSON.parse(filesJson);
        const adjustedFiles = filesArray.map(file => ({
          filePath: addFilePrefixIfNeeded(file.path),
          fileName: file.name,
          fileMimeType: file.mimeType
        }));

        dispatch(setSharedFiles(adjustedFiles));

        if (selectedSubApplication) {
          props.navigation.navigate(selectedSubApplication);
        }

        await clearSharedFileData();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const clearSharedFileData = async () => {
    await DefaultPreference.set("sharedFiles", "");
  };

  // On mount, load shared file and listen for deep links
  useEffect(() => {
    // Initial load
    loadSharedFileData();

    // Handle deep links
    const handleOpenURL = () => {
      loadSharedFileData();
    };
    Linking.addEventListener("url", handleOpenURL);

    // Check if app was launched with a link
    Linking.getInitialURL().then((url) => {
      if (url) {
        loadSharedFileData();
      }
    });
  }, []);

  // Listen to AppState changes
  useEffect(() => {
    const subscription = AppState.addEventListener("change", async (nextState) => {
      if (nextState === "active") {
        loadSharedFileData();
      } else {
        await clearSharedFileData();
      }
    });

    loadSharedFileData();

    return () => {
      subscription.remove();
    };
  }, []);

  // UI Helpers
  const getBackgroundImage = () => (isTablet() ? background : backgroundMobile);

  const getImageBackground = () => {
    if (isTablet()) {
      if (isTabletSmall()) {
        return etendoBoyImgSmall;
      }
      return etendoBoyImg;
    } else {
      return etendoBoyMobile;
    }
  };

  const getNameInBody = () => (data?.username ? data?.username + "!" : null);

  const processedMenuItems = menuItems?.map((item, index) => ({
    ...item,
    uniqueId: generateUniqueId(item.name),
    screenName: item.name,
  }));

  useEffect(() => {
    const rehydrateContextPath = async () => {
      try {
        const storedContextPath = await AsyncStorage.getItem('contextPathUrl');
        if (storedContextPath) {
          dispatch(setContextPathUrl(storedContextPath));
        } else if (selectedUrl) {
          const hostUrl = formatEnvironmentUrl(selectedUrl);
          const extractedPath = getContextPath(selectedUrl);
          dispatch(setSelectedEnvironmentUrl(hostUrl));
          dispatch(setContextPathUrl(extractedPath));
          await AsyncStorage.setItem('contextPathUrl', extractedPath);
        }
      } catch (error) {
        console.error('Error loading contextPathUrl from AsyncStorage', error);
      }
    };

    rehydrateContextPath();
  }, [dispatch, selectedUrl]);

  return (
    <View style={styles.container}>
      <ImageBackground source={getBackgroundImage()} style={styles.imgBackground}>
        {isTablet() ? (
          <ScrollView horizontal style={styles.conteinerMed}>
            <>
              {processedMenuItems?.map((menuItem: any, index: number) => (
                <View key={"CardDropdown" + index} style={{ marginLeft: 35 }}>
                  <CardDropdown
                    title={menuItem.name}
                    image={<StarIcon />}
                    onPress={() => {
                      dispatch(setIsSubapp(true));
                      props.navigation.navigate(menuItem.screenName);
                    }}
                  />
                </View>
              ))}
            </>
            {loading && <LoadingHome />}
          </ScrollView>
        ) : (
          <View style={styles.welcomeMobile}>
            <Text style={styles.welcomeText}>{locale.t("WelcomeToEtendoHome")}</Text>
            <Text style={styles.welcomeName}>{getNameInBody()}</Text>
          </View>
        )}
        <Image style={deviceStyles.imageBackground} source={getImageBackground()} />
      </ImageBackground>
    </View>
  );
};

const Home = (props: any) => {
  const navigation = useNavigation();
  const selectedLanguage = useAppSelector(selectSelectedLanguage);
  Etendo.globalNav = navigation;
  // Force to re-render when language changes at login
  useEffect(() => { }, [locale, selectedLanguage]);

  return <HomeComponent {...props} />;
};
export default Home;
