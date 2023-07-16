import React, { useContext } from "react";
import { Image, View, Text, ImageBackground, ScrollView } from "react-native";
import { ContainerContext } from "../../contexts/ContainerContext";
import locale from "../../i18n/locale";
import { useNavigation } from "@react-navigation/native";
import { Etendo } from "../../helpers/Etendo";
import styles from "./styles";
import { INavigation } from "../../interfaces";
import { isTablet } from "../../../hook/isTablet";
import { User } from "../../stores";
import { deviceStyles } from "./deviceStyles";
import CardDropdown from "etendo-ui-library/dist-native/components/cards/cardDropdown/CardDropdown";
import { StarIcon } from "etendo-ui-library/dist-native/assets/images/icons/StarIcon";
import { isTabletSmall } from "../../helpers/IsTablet";
import LoadingHome from "../../components/LoadingHome";

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
  const context = useContext(ContainerContext);

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
    return User?.data?.username ? User?.data?.username + "!" : null;
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={getBackground()} style={styles.imgBackground}>
        {isTablet() ? (
          <ScrollView horizontal style={styles.conteinerMed}>
            {context?.state?.loading ? (
              <LoadingHome />
            ) : (
              context?.state?.menuItems.map((menuItem: any, index: number) => {
                return (
                  <View key={"CardDropdown" + index} style={{ marginLeft: 35 }}>
                    <CardDropdown
                      title={menuItem.name}
                      image={<StarIcon />}
                      onPress={() => props.navigation.navigate(menuItem.name)}
                    />
                  </View>
                );
              })
            )}
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
  Etendo.globalNav = navigation;

  return <HomeFunction {...props} />;
};
export default Home;
