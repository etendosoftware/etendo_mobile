import React from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  View,
  Text,
  TouchableOpacity
} from "react-native";
import locale from "../i18n/locale";
import withAuthentication from "../withAuthentication";
import { observer } from "mobx-react";
import { Appbar, Button } from "react-native-paper";
import MainAppContext from "../contexts/MainAppContext";
import { INavigation } from "../components/Card";
import Icon from "react-native-vector-icons/Ionicons";
import { defaultTheme } from "../themes";
import { Platform } from "react-native";
import { BackHandler } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Etendo } from "../helpers/Etendo";

interface Props {
  navigation: INavigation;
  appMinCoreVersion: string;
  coreVersion: string;
}

interface State {}

const win = Dimensions.get("window");
const ratio = win.width / 1080; //541 is actual image width

@observer
class HomeClass extends React.Component<Props, State> {
  static contextType = MainAppContext;
  render() {
    return (
      <View style={{ backgroundColor: defaultTheme.colors.background }}>
        <Appbar.Header dark={true}>
          <Appbar.Action
            icon="menu"
            onPress={() => this.props.navigation.toggleDrawer()}
          />
          <Appbar.Content title={locale.t("Home:Title")} />
        </Appbar.Header>
        <View style={styles.conteinerSup}>
          <View
            style={{
              height: "55%",
              width: "40%",
              backgroundColor: defaultTheme.colors.accent
            }}
          >
            <Image
              style={styles.logo}
              resizeMode={"stretch"}
              source={require("../img/home2.png")}
            />
          </View>
          <View style={{ height: "55%", width: "50%", marginRight: 10 }}>
            <Text allowFontScaling={false} style={styles.text}>
              {locale.t("Welcome!")}
            </Text>
            <Image
              style={styles.etendo}
              resizeMode={"contain"}
              source={require("../img/etendo-logo-1.png")}
            />
          </View>
          <View
            style={{
              width: "10%",
              backgroundColor: defaultTheme.colors.accent,
              height: "55%"
            }}
          ></View>
        </View>
        <View style={styles.conteinerMed}>
          <View style={styles.button}>
            <Icon name="person-circle" size={25} style={styles.TextIcon} />
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => this.props.navigation.navigate("Profile")}
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
              onPress={() => this.props.navigation.navigate("Settings")}
            >
              <Button>
                <Text allowFontScaling={false} style={styles.TextIcon}>
                  {locale.t("Settings")}{" "}
                </Text>
              </Button>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.conteinerInf}>
          <Image
            style={styles.image}
            source={require("../img/home.png")}
            width={win.width}
          />
        </View>
      </View>
    );
  }
}
const Home = (props) => {
  const navigation = useNavigation();
  Etendo.globalNav = navigation;

  return (
    <HomeClass {...props} />
  )
}
export default withAuthentication(Home);

const styles = StyleSheet.create({
  image: {
    height: 600,
    width: "100%",
    position: "absolute"
  },
  logo: {
    height: "100%",
    width: "80%"
  },
  etendo: {
    height: "90%",
    width: "100%",
    position: "absolute"
  },
  text: {
    display: "flex",
    alignSelf: "flex-end",
    color: defaultTheme.colors.textSecondary,
    position: "relative",
    marginTop: "30%",
    fontSize: 20
  },

  conteinerSup: {
    display: "flex",
    width: win.width,
    flexDirection: "row",
    justifyContent: "space-between",
    height: "16%",
    alignItems: "center",
    marginTop: 20
  },
  conteinerMed: {
    display: "flex",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignSelf: "center",
    height: "8%",
    marginTop: 20,
    marginLeft: 10
  },
  conteinerInf: {
    display: "flex",
    width: "100%",
    flexDirection: "row",
    height: "80%"
  },
  button: {
    width: "32%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center"
  },
  buttonFaq: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
    marginLeft: "62%",
    marginTop: Platform.OS === "ios" ? "10%" : "25%"
  },
  TextIcon: {
    color: defaultTheme.colors.textSecondary
  }
});
