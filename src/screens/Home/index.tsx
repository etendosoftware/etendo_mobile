import React, { useEffect, useMemo, useState } from "react";
import {
  Image,
  View,
  Text,
  ImageBackground,
  ScrollView,
  Platform,
  AppState,
  Linking,
} from "react-native";
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
import SharedGroupPreferences from "react-native-shared-group-preferences";

const etendoBoyImg = require("../../../assets/etendo-bk-tablet.png");
const etendoBoyImgSmall = require("../../../assets/etendo-bk-tablet-small.png");
const etendoBoyMobile = require("../../../assets/etendo-bk-mobile.png");
const background = require("../../../assets/background.png");
const backgroundMobile = require("../../../assets/background-mobile.png");
interface Props {
  navigation: INavigation;
  appMinCoreVersion: string;
  coreVersion: string;
}
const HomeFunction = (props: Props) => {
  const data = useAppSelector(selectData);
  const loading = useAppSelector(selectLoading);
  const menuItems = useAppSelector(selectMenuItems);
  const token = useAppSelector(selectToken);
  const selectedUrl = useAppSelector(selectSelectedUrl);
  const dispatch = useAppDispatch();

  const [fileData, setFileData] = useState(null);
  const [audioPlayer, setAudioPlayer] = useState<any>(null);

  const saveTokenAndURLToSharedGroup = async (token: string, urlToFetchSubApps: string) => {
    try {
      const sharedData = { token, urlToFetchSubApps };
      await SharedGroupPreferences.setItem("token", token, References.AppGroupIdentifier);
      await SharedGroupPreferences.setItem("urlToFetchSubApps", urlToFetchSubApps, References.AppGroupIdentifier);
    } catch (error) {
      console.error("Error saving data to Shared Group Preferences:", error);
    }
  };

  useMemo(() => {
    selectedUrl
      ? OBRest.init(new URL(selectedUrl), token)
      : OBRest.init(new URL(References.DemoUrl), token);

    OBRest.loginWithToken(token);
  }, [selectedUrl, token]);

  useEffect(() => {
    if (token && selectedUrl) {
      saveTokenAndURLToSharedGroup(token, selectedUrl);
    }
  }, [token, selectedUrl]);

  const loadSharedFileData = async () => {
    try {
      await DefaultPreference.setName(References.AppGroupIdentifier);

      const filePaths = await SharedGroupPreferences.getItem("sharedFilePaths", References.AppGroupIdentifier);
      const fileNames = await SharedGroupPreferences.getItem("sharedFileNames", References.AppGroupIdentifier);
      const fileMimeTypes = await SharedGroupPreferences.getItem("sharedFileMimeTypes", References.AppGroupIdentifier);

      if (
        Array.isArray(filePaths) && filePaths.length > 0 &&
        Array.isArray(fileNames) && fileNames.length > 0 &&
        Array.isArray(fileMimeTypes) && fileMimeTypes.length > 0
      ) {
        const filesData = filePaths.map((path, index) => ({
          filePath: Platform.OS === "ios" && !path.startsWith("file://") ? "file://" + path : path,
          fileName: fileNames[index],
          fileMimeType: fileMimeTypes[index],
        }));

        setFileData(filesData);
        dispatch(setSharedFiles(filesData));
      } else {
        setFileData(null);
        dispatch(setSharedFiles([]));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const clearSharedDefaults = async () => {
    try {
      await SharedGroupPreferences.setItem("sharedFilePaths", [], References.AppGroupIdentifier);
      await SharedGroupPreferences.setItem("sharedFileNames", [], References.AppGroupIdentifier);
      await SharedGroupPreferences.setItem("sharedFileMimeTypes", [], References.AppGroupIdentifier);
    } catch (error) {
      console.error("Error clearing shared defaults:", error);
    }
  };

  useEffect(() => {
    const handleAppStateChange = async (nextAppState: string) => {
      if (nextAppState === "background" || nextAppState === "inactive") {
        dispatch(setSharedFiles([]));
        await clearSharedDefaults();
      } else if (nextAppState === "active") {
        loadSharedFileData();
      }
    };

    const handleOpenURL = (event) => {
      loadSharedFileData();
    };

    AppState.addEventListener("change", handleAppStateChange);
    Linking.addEventListener("url", handleOpenURL);

    Linking.getInitialURL().then((url) => {
      if (url) {
        loadSharedFileData();
      }
    });

    loadSharedFileData();

    return () => {
      if (audioPlayer) {
        audioPlayer.release();
      }
    };
  }, [audioPlayer, dispatch]);

  const getBackground = () => (isTablet() ? background : backgroundMobile);

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
    screenName: `${item.name}_${index}`,
  }));

  return (
    <View style={styles.container}>
      <ImageBackground source={getBackground()} style={styles.imgBackground}>
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

  return <HomeFunction {...props} />;
};
export default Home;
