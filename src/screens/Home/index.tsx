import React from "react";
import { Image, View, Text, TouchableOpacity } from "react-native";
import locale from "../../i18n/locale";
import withAuthentication from "../../withAuthentication";
import { observer } from "mobx-react-lite";
import { Appbar, Button } from "react-native-paper";
import Icon from "react-native-vector-icons/Ionicons";

const etendoBoyImg = require("../../img/etendo_boy_back.png");
import { useNavigation } from "@react-navigation/native";
import { Etendo } from "../../helpers/Etendo";
import { defaultTheme } from "../../themes";
import { styles } from "./style";
import { INavigation } from "../../interfaces";

interface Props {
  navigation: INavigation;
  appMinCoreVersion: string;
  coreVersion: string;
}

const HomeFunction = observer((props: Props) => {
  return (
    <View style={styles.container}>
      <Appbar.Header dark={true}>
        <Appbar.Action
          icon="menu"
          onPress={() => props.navigation.toggleDrawer()}
        />
        <Appbar.Content title={locale.t("Home:Title")} />
      </Appbar.Header>
      <View style={styles.conteinerSup}>
        <View
          style={{
            flex: 1,
            backgroundColor: defaultTheme.colors.accent
          }}
        >
          <Image
            style={styles.logo}
            resizeMode={"stretch"}
            source={require("../../img/home2.png")}
          />
        </View>
        <View style={styles.etendoContainer}>
          <Image
            style={styles.etendo}
            source={require("../../img/etendo-logo-1.png")}
          />
          <Text allowFontScaling={false} style={styles.text}>
            {locale.t("Welcome!")}
          </Text>
        </View>
        <View
          style={{
            width: "10%",
            backgroundColor: defaultTheme.colors.accent,
            height: "100%"
          }}
        />
      </View>
      <View style={styles.conteinerMed}>
        <View style={styles.button}>
          <Icon name="person-circle" size={25} style={styles.TextIcon} />
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => props.navigation.navigate("Profile")}
          >
            <Button>
              <Text allowFontScaling={false} style={styles.TextIcon}>
                {locale.t("Profile")}{" "}
              </Text>
            </Button>
          </TouchableOpacity>
        </View>
        <View style={styles.button}>
          <Icon name="md-settings" size={20} style={styles.TextIcon} />
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => props.navigation.navigate("Settings")}
          >
            <Button>
              <Text allowFontScaling={false} style={styles.TextIcon}>
                {locale.t("Settings")}
              </Text>
            </Button>
          </TouchableOpacity>
        </View>
      </View>
      <Image style={styles.image} source={etendoBoyImg} />
    </View>
  );
});

const Home = (props) => {
  const navigation = useNavigation();
  Etendo.globalNav = navigation;

  return <HomeFunction {...props} />;
};
export default withAuthentication(Home);
