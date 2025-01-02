import React, { useEffect, useState, useRef } from "react";
import { Image, View, Text, ImageBackground, ScrollView, Platform, Linking, AppState } from "react-native";
import locale from "../../i18n/locale";
import { useNavigation } from "@react-navigation/native";
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
} from "../../../redux/user";
import { useAppDispatch, useAppSelector } from "../../../redux";
import {
  selectLoading,
  selectMenuItems,
  setIsSubapp,
} from "../../../redux/window";
import { OBRest } from "etrest";
import { generateUniqueId } from "../../utils";
import { References } from "../../constants/References";
import DefaultPreference from "react-native-default-preference";
import RNFS from "react-native-fs";
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

  // Ref to track the last loaded file
  const lastFilePathRef = useRef<string | null>(null);

  // On mount, set the AppGroup identifier based on the platform
  useEffect(() => {
    if (Platform.OS === "ios") {
      DefaultPreference.setName(AppGroupIdentifierIos);
    } else {
      DefaultPreference.setName(AppGroupIdentifierAndroid);
    }
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

  useEffect(() => {
    if (token && selectedUrl) {
      saveTokenAndURL(token, selectedUrl);
    }
  }, [token, selectedUrl]);

  // Utility to add 'file://' prefix if missing
  const addFilePrefixIfNeeded = (path: string) => {
    return path.startsWith("file://") ? path : `file://${path}`;
  };

  const clearSharedFileData = async () => {
    try {
      await DefaultPreference.set("sharedFilePath", "");
      await DefaultPreference.set("sharedFileName", "");
      await DefaultPreference.set("sharedFileMimeType", "");
      await DefaultPreference.set("selectedSubApplication", "");
    } catch (error) {
      console.error("Error limpiando datos de archivos compartidos:", error);
    }
  };

  const loadSharedFileData = async () => {
    try {
      const filePath = await DefaultPreference.get("sharedFilePath");
      const fileName = await DefaultPreference.get("sharedFileName");
      const fileMimeType = await DefaultPreference.get("sharedFileMimeType");
      const selectedSubApplication = await DefaultPreference.get("selectedSubApplication");

      // Check if a new file exists
      if (filePath && fileName && fileMimeType) {
        const adjustedPath = addFilePrefixIfNeeded(filePath);

        const newFileData = {
          filePath: adjustedPath,
          fileName,
          fileMimeType,
        };

        dispatch(setSharedFiles([newFileData]));

        if (selectedSubApplication) {
          props.navigation.navigate(selectedSubApplication);
        }

        await clearSharedFileData();
      }
    } catch (error) {
      console.error(error);
    }
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

  const getNameInBody = () => {
    return data?.username ? data?.username + "!" : null;
  };

  const processedMenuItems = menuItems?.map((item, index) => ({
    ...item,
    uniqueId: generateUniqueId(item.name),
    screenName: `${item.name}_${index}`,
  }));

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
            <Text style={styles.welcomeText}>
              {locale.t("WelcomeToEtendoHome")}
            </Text>
            <Text style={styles.welcomeName}>{getNameInBody()}</Text>
          </View>
        )}
        <Image
          style={deviceStyles.imageBackground}
          source={getImageBackground()}
        />
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
