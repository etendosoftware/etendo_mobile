import React, { useEffect, useState, useContext } from "react";
import {
  Image,
  View,
  Text,
  ImageBackground,
  ScrollView,
  DeviceEventEmitter
} from "react-native";
import { ContainerContext } from "../../contexts/ContainerContext";
import locale from "../../i18n/locale";
import withAuthentication from "../../withAuthentication";
import { observer } from "mobx-react-lite";
import { useNavigation } from "@react-navigation/native";
import { Etendo } from "../../helpers/Etendo";
import styles from "./styles";
import { INavigation } from "../../interfaces";
import { isTablet } from "../../../hook/isTablet";
import { OBRest, Restrictions } from "etrest";
import { User } from "../../stores";
import { deviceStyles } from "./deviceStyles";
import CardDropdown from "etendo-ui-library/dist-native/components/cards/cardDropdown/CardDropdown";
import { StarIcon } from "etendo-ui-library/dist-native/assets/images/icons/StarIcon";

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
  const [profileImage, setProfileImage] = useState<any>([]);
  const context = useContext(ContainerContext);
  useEffect(() => {
    getImageProfile().catch((error) => {});
  }, [profileImage]);

  const getImageProfile = async () => {
    try {
      const imageIdCriteria = OBRest.getInstance().createCriteria("ADUser");
      imageIdCriteria.add(Restrictions.equals("id", User.data.userId));
      const user: any = await imageIdCriteria.uniqueResult();
      const imageCriteria = OBRest.getInstance().createCriteria("ADImage");
      imageCriteria.add(Restrictions.equals("id", user.image));
      const imageList: any[] = await imageCriteria.list();
      setProfileImage(imageList);
    } catch (error) {}
  };

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
          <ScrollView horizontal style={styles.conteinerMed}>
            {context?.state?.menuItems.lenght > 0 &&
              context?.state?.menuItems.map((menuItem: any) => {
                return (
                  <CardDropdown
                    title={menuItem.name}
                    key={menuItem.name}
                    image={<StarIcon />}
                    onPress={() => props.navigation.navigate(menuItem.name)}
                  />
                );
              })}
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
});

const Home = (props: any) => {
  const navigation = useNavigation();
  Etendo.globalNav = navigation;

  return <HomeFunction {...props} />;
};
export default withAuthentication(Home);
