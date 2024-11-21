import React, { useEffect, useMemo, useState } from "react";
import { Image, View, Text, ImageBackground, ScrollView, Platform } from "react-native";
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
import { Linking } from "react-native";
import { setSharedFiles } from "../../../redux/shared-files-reducer";

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

  const [fileData, setFileData] = useState({
    filePath: null,
    fileName: null,
    fileMimeType: null,
  });
  const [audioPlayer, setAudioPlayer] = useState<any>(null);
  const [textContent, setTextContent] = useState("");

  useMemo(() => {
    selectedUrl
      ? OBRest.init(new URL(selectedUrl), token)
      : OBRest.init(new URL(References.DemoUrl), token);

    OBRest.loginWithToken(token);
  }, []);

  const saveTokenAndURL = async (token: string, urlToFetchSubApps: string) => {
    try {
      await DefaultPreference.setName(References.AppGroupIdentifier);
      await DefaultPreference.set("token", token);
      await DefaultPreference.set("urlToFetchSubApps", urlToFetchSubApps);
    } catch (error) {
      console.error(error);
    }
  };

  const checkToken = async () => {
    await DefaultPreference.setName(References.AppGroupIdentifier);
    const savedToken = await DefaultPreference.get("token");
    const savedUrl = await DefaultPreference.get("urlToFetchSubApps");
  };

  useEffect(() => {
    checkToken();
  }, []);

  useEffect(() => {
    if (token && selectedUrl) {
      saveTokenAndURL(token, selectedUrl);
    }
  }, [token, selectedUrl]);

  const loadSharedFileData = async () => {
    try {
      await DefaultPreference.setName(References.AppGroupIdentifier);

      const filePath = await DefaultPreference.get("sharedFilePath");
      const fileName = await DefaultPreference.get("sharedFileName");
      const fileMimeType = await DefaultPreference.get("sharedFileMimeType");

      if (filePath && fileName && fileMimeType) {
        const adjustedPath =
          Platform.OS === "ios" && !filePath.startsWith("file://")
            ? "file://" + filePath
            : filePath;

        const fileData: any = {
          filePath: adjustedPath,
          fileName,
          fileMimeType,
        };

        setFileData(fileData);

        if (fileMimeType.startsWith("text/")) {
          const content = await RNFS.readFile(adjustedPath, "utf8");
          setTextContent(content);
        } else {
          setTextContent("");
        }

        dispatch(setSharedFiles([fileData]));
      } else {
        setFileData({
          filePath: null,
          fileName: null,
          fileMimeType: null,
        });
        setTextContent("");

        dispatch(setSharedFiles([]));
      }
    } catch (error) {
      console.error(error);
    }
  };


  useEffect(() => {
    loadSharedFileData();

    const handleOpenURL = (event: any) => {
      loadSharedFileData();
    };

    Linking.addEventListener("url", handleOpenURL);

    Linking.getInitialURL().then((url) => {
      if (url) {
        loadSharedFileData();
      }
    });

    return () => {
      if (audioPlayer) {
        audioPlayer.release();
      }
    };
  }, [audioPlayer]);

  const getBackground = () => {
    return isTablet() ? background : backgroundMobile;
  };

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

  return <HomeFunction {...props} />;
};
export default Home;
