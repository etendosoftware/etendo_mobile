import React, { useEffect } from "react";
import {
  Image,
  View,
  Text,
  ImageBackground,
  ScrollView,
  DeviceEventEmitter
} from "react-native";

import locale from "../../i18n/locale";
import withAuthentication from "../../withAuthentication";
import { observer } from "mobx-react-lite";
import { useNavigation } from "@react-navigation/native";
import { Etendo } from "../../helpers/Etendo";
import styles from "./styles";
import { INavigation } from "../../interfaces";
import { isTablet } from "../../../hook/isTablet";

import { User } from "../../stores";
import { deviceStyles } from "./deviceStyles";

const etendoBoyImg = require("../../../assets/etendo-bk-tablet.png");
const etendoBoyMobile = require("../../../assets/etendo-bk-mobile.png");
const background = require("../../../assets/background.png");
const backgroundMobile = require("../../../assets/background-mobile.png");
interface Props {
  navigation: INavigation;
  appMinCoreVersion: string;
  coreVersion: string;
}

const HomeFunction = observer((props: Props) => {
  const getBackground = () => {
    return isTablet() ? background : backgroundMobile;
  };

  const getImageBackground = () => {
    return isTablet() ? etendoBoyImg : etendoBoyMobile;
  };

  const getNameInBody = () => {
    return User?.data?.username ? User?.data?.username + "!" : null;
  };

  useEffect(() => {
    DeviceEventEmitter.emit("showNavbar", { state: true });
  }, []);
  return (
    <View style={styles.container}>
      <ImageBackground source={getBackground()} style={styles.imgBackground}>
        {isTablet() ? (
          <ScrollView horizontal style={styles.conteinerMed} />
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
});

const Home = (props: any) => {
  const navigation = useNavigation();
  Etendo.globalNav = navigation;

  return <HomeFunction {...props} />;
};
export default withAuthentication(Home);
