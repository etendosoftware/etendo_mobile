import React from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
  ScrollView,
  StatusBar
} from "react-native";
import locale from "../i18n/locale";
import withAuthentication from "../withAuthentication";
import { observer } from "mobx-react";
import { Button } from "react-native-paper";
import { INavigation } from "../components/Card";
import Icon from "react-native-vector-icons/Ionicons";
import { defaultTheme } from "../themes";
import { isTablet } from "../../hook/isTablet";
const etendoBoyImg = require("../img/etendo_boy_back.png");
import { useNavigation } from "@react-navigation/native";
import { Etendo } from "../helpers/Etendo";
import CardDropdown from "../../ui/components/cards/cardDropdown";
import { ContainerContext } from "../contexts/ContainerContext";
import { StarIcon } from "../../ui/assets/images/icons/StarIcon";
import { Navbar } from "../../ui/components";

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
  static contextType = ContainerContext;

  render() {
    const context = this.context;
    return (
      <View style={[styles.container, { marginTop: StatusBar.currentHeight }]}>
        <Navbar
          onOptionSelectedProfile={() => {}}
          onPressLogo={() => {}}
          onPressMenuBurger={function(): void {
            Etendo.toggleDrawer();
          }}
        />
        {isTablet() && (
          <ScrollView horizontal style={styles.conteinerMed}>
            {context?.state?.menuItems.map((menuItem: any) => {
              return (
                <CardDropdown
                  title={menuItem?.name}
                  image={<StarIcon />}
                  onPress={() => this.props.navigation.navigate(menuItem.name)}
                />
              );
            })}
          </ScrollView>
        )}
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
                  {locale.t("Settings")}
                </Text>
              </Button>
            </TouchableOpacity>
          </View>
        </View>
        <Image style={styles.image} source={etendoBoyImg} />
      </View>
    );
  }
}
const Home = (props) => {
  const navigation = useNavigation();
  Etendo.globalNav = navigation;

  return <HomeClass {...props} />;
};
export default withAuthentication(Home);

const styles = StyleSheet.create({
  container: {
    backgroundColor: defaultTheme.colors.background,
    height: "100%"
  },
  image: {
    height: 342,
    width: 364,
    right: 0,
    bottom: 0,
    position: "absolute"
  },
  logo: {
    height: "100%",
    width: 130
  },
  etendo: {
    height: 50,
    width: 200
  },
  etendoContainer: {
    height: "100%",
    width: isTablet() ? 260 : 220,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column"
  },
  text: {
    color: defaultTheme.colors.textSecondary,
    fontSize: 20,
    alignSelf: "flex-end",
    paddingRight: isTablet() ? 40 : 20
  },

  conteinerSup: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    height: 80,
    alignItems: "center",
    marginTop: 20
  },
  conteinerMed: {
    display: "flex",
    width: "100%",
    flexDirection: "row",
    alignSelf: "center",
    marginTop: 50,
    marginLeft: 52
  },
  conteinerInf: {
    display: "flex",
    width: "100%",
    flexDirection: "row",
    height: "80%"
  },
  button: {
    width: "50%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
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
