import React, { useContext, useEffect, useState } from "react";
import {
  Image,
  View,
  SafeAreaView,
  Text,
  StatusBar,
  ImageBackground,
  ScrollView,
  Dimensions
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
import { OBRest, Restrictions } from "obrest";
import { User, logout } from "../../stores";
import { ContainerContext } from "../../contexts/ContainerContext";
import CardDropown from "etendo-ui-library/dist-native/components/cards/cardDropdown/CardDropdown";

const etendoBoyImg = require("../../../assets/etendo-bk-tablet.png");
const etendoBoyMobile = require("../../../assets/etendo-bk-mobile.png");
const background = require("../../../assets/background.png");
const backgroundMobile = require("../../../assets/backgroud-mobile.png");

const height = Dimensions.get("window").height;

interface Props {
  navigation: INavigation;
  appMinCoreVersion: string;
  coreVersion: string;
}

const HomeFunction = observer((props: Props) => {
  const [profileImage, setProfileImage] = useState<any>();
  const context = useContext(ContainerContext);
  useEffect(() => {
    getImage().catch((error) => {});
  }, []);

  const getImage = async () => {
    try {
      const imageIdCriteria = OBRest.getInstance().createCriteria("ADUser");
      imageIdCriteria.add(Restrictions.equals("id", User.data.userId));
      const user: any = await imageIdCriteria.uniqueResult();
      const imageCriteria = OBRest.getInstance().createCriteria("ADImage");
      imageCriteria.add(Restrictions.equals("id", user.image));
      const imageList: any[] = await imageCriteria.list();
      const image = imageList[0]; // Suponemos que solo queremos el primer elemento de la lista
      setProfileImage(image);
    } catch (error) {
      // Manejar el error aquí si es necesario
    }
  };
  const onOptionPressHandle = async (route: string) => {
    if (route === "logout") {
      await logout();
    }
    props.navigation.navigate(route);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={isTablet() ? background : backgroundMobile}
        style={[styles.imgBackground]}
      >
        <Navbar
          optionsProfile={[
            {
              title: "Profile and settings",
              image: <ConfigurationIcon />,
              route: "Settings"
            }
          ]}
          onOptionSelectedProfile={async (route: string, index: number) => {
            await onOptionPressHandle(route);
          }}
          name={User?.data?.username ? User?.data?.username : "A"}
          profileImage={
            profileImage && (
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
          <ScrollView horizontal style={styles.conteinerMed}>
            {context?.state?.menuItems.map(() => {
              return <CardDropown />;
            })}
          </ScrollView>
        ) : (
          <View style={styles.welcomeMobile}>
            <Text style={styles.welcomeText}>{locale.t("Welcome")}</Text>
            <Text style={styles.welcomeName}>{User?.data?.username}</Text>
          </View>
        )}
        <Image
          style={[styles.image, isTablet() && { width: "100%" }]}
          source={isTablet() ? etendoBoyImg : etendoBoyMobile}
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
