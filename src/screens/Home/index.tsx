import React, { useEffect, useState } from "react";
import {
  Image,
  View,
  SafeAreaView,
  Text,
  ImageBackground,
  ScrollView
} from "react-native";

import locale from "../../i18n/locale";
import withAuthentication from "../../withAuthentication";
import { observer } from "mobx-react-lite";
import { useNavigation } from "@react-navigation/native";
import { Etendo } from "../../helpers/Etendo";
import styles from "./styles";
import { INavigation } from "../../interfaces";
import Navbar from "etendo-ui-library/dist-native/components/navbar/Navbar";
import { isTablet } from "../../../hook/isTablet";
import { ConfigurationIcon } from "etendo-ui-library/dist-native/assets/images/icons/ConfigurationIcon";
import { UserNoBorder } from "etendo-ui-library/dist-native/assets/images/icons/UserNoBorder";
import { OBRest, Restrictions } from "obrest";
import { User, logout } from "../../stores";
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
  const [profileImage, setProfileImage] = useState<any>([]);

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

  const onOptionPressHandle = async (route: string) => {
    if (route === "logout") {
      await logout();
    }
    props.navigation.navigate(route);
  };

  const getBackground = () => {
    return isTablet() ? background : backgroundMobile;
  };

  const getImageBackground = () => {
    return isTablet() ? etendoBoyImg : etendoBoyMobile;
  };

  const getName = () => {
    return User?.data?.username ? User?.data?.username : "A";
  };

  const getNameInBody = () => {
    return User?.data?.username ? User?.data?.username + "!" : null;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground source={getBackground()} style={styles.imgBackground}>
        <Navbar
          optionsProfile={[
            {
              title: "Profile",
              image: <UserNoBorder />,
              route: "Profile"
            },
            {
              title: "Settings",
              image: <ConfigurationIcon />,
              route: "Settings"
            }
          ]}
          onOptionSelectedProfile={async (route: string) => {
            await onOptionPressHandle(route);
          }}
          name={getName()}
          profileImage={
            profileImage.length && (
              <Image
                source={{
                  uri: `data:image/jpeg;base64,${profileImage[0].bindaryData}`
                }}
              />
            )
          }
          onPressLogo={() => {}}
          onPressMenuBurger={() => {}}
        />
        {isTablet() ? (
          <ScrollView horizontal style={styles.conteinerMed} />
        ) : (
          <View style={styles.welcomeMobile}>
            <Text style={styles.welcomeText}>{locale.t("Welcome")}</Text>
            <Text style={styles.welcomeName}>{getNameInBody()}</Text>
          </View>
        )}
        <Image
          style={deviceStyles.imageBackground}
          source={getImageBackground()}
        />
      </ImageBackground>
    </SafeAreaView>
  );
});

const Home = (props: any) => {
  const navigation = useNavigation();
  Etendo.globalNav = navigation;

  return <HomeFunction {...props} />;
};
export default withAuthentication(Home);
