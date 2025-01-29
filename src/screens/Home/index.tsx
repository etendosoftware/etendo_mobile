import React, { useEffect, useMemo } from "react";
import { Image, View, Text, ImageBackground, ScrollView } from "react-native";
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
  setIsSubapp
} from "../../../redux/window";
import { OBRest } from "etrest";
import { generateUniqueId, getContextPathFromUrl, getHostAndPortFromUrl } from "../../utils";
import { References } from "../../constants/References";

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

  useMemo(() => {
    selectedUrl
      ? OBRest.init(new URL(selectedUrl), token)
      : OBRest.init(new URL(References.DemoUrl), token);

    OBRest.loginWithToken(token);
  }, []);

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

  useEffect(() => {
    const rehydrateContextPath = async () => {
      try {
        const storedContextPath = await AsyncStorage.getItem('contextPathUrl');
        if (storedContextPath) {
          dispatch(setContextPathUrl(storedContextPath));
        } else if (selectedUrl) {
          const hostAndPortUrl = getHostAndPortFromUrl(selectedUrl);
          const extractedPath = getContextPathFromUrl(selectedUrl);
          dispatch(setSelectedEnvironmentUrl(hostAndPortUrl));
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
