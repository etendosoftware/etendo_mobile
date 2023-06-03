import React from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  View,
  Text,
  Platform,
  ImageBackground,
  StatusBar
} from "react-native";
import withAuthentication from "../withAuthentication";
import { observer } from "mobx-react";
import { INavigation } from "../components/Card";
import { defaultTheme } from "../themes";
import { isTablet } from "../../hook/isTablet";
import { useNavigation } from "@react-navigation/native";
import { Etendo } from "../helpers/Etendo";
import { Navbar } from "../../ui/components";
import { ContainerContext } from "../contexts/ContainerContext";
import { ConfigurationIcon } from "../../ui/assets/images/icons/ConfigurationIcon";
import { OBRest, Restrictions } from "obrest";
import { User, logout } from "../stores";
import { PRIMARY_100 } from "../../ui/styles/colors";
const etendoBoyImg = require("../../assets/etendo-bk-tablet.png");
const etendoBoyMobile = require("../../assets/etendo-bk-mobile.png");
const background = require("../../assets/background.png");
const backgroundMobile = require("../../assets/backgroud-mobile.png");

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
  constructor(props) {
    super(props);
    this.state = {
      image: null
    };
  }

  componentDidMount = async () => {
    this.setState({ image: await this.getImage() });
  };

  getImage = async () => {
    let imageIdCriteria = OBRest.getInstance().createCriteria("ADUser");
    imageIdCriteria.add(Restrictions.equals("id", User.data.userId));
    let user: any = await imageIdCriteria.uniqueResult();
    let imageCriteria = OBRest.getInstance().createCriteria("ADImage");
    imageCriteria.add(Restrictions.equals("id", user.image));
    let image: any = await imageCriteria.list();
    return image;
  };

  handleLogout = async () => {
    await logout();
    this.setState({ menuItems: [] });
  };
  render() {
    const img = this.state.image;

    return (
      <ImageBackground
        source={isTablet() ? background : backgroundMobile}
        style={[
          styles.container,
          { marginTop: StatusBar.currentHeight, height: win.height }
        ]}
      >
        <Navbar
          optionsProfile={[
            {
              title: "Profile and settings",
              image: <ConfigurationIcon />,
              route: "Settings"
            }
          ]}
          onOptionSelectedProfile={(route: string, index: number) => {
            if (route === "logout") {
              return this.handleLogout();
            }
            this.props.navigation.navigate(route);
          }}
          name={User?.data?.username ? User?.data?.username : "A"}
          profileImage={
            img && (
              <Image
                source={{
                  uri: `data:image/jpeg;base64,${img[0].bindaryData}`
                }}
              />
            )
          }
          onPressLogo={() => this.props.navigation.navigate("Profile")}
          onPressMenuBurger={() => this.props.navigation.navigate("Profile")}
        />
        {isTablet() ? (
          <View horizontal style={styles.conteinerMed}></View>
        ) : (
          <View style={styles.welcomeMobile}>
            <Text style={styles.welcomeText}>Welcome to Etendo,</Text>
            <Text style={styles.welcomeName}>{User?.data?.username}</Text>
          </View>
        )}

        <Image
          style={[styles.image, isTablet() && { width: "100%" }]}
          source={isTablet() ? etendoBoyImg : etendoBoyMobile}
        />
      </ImageBackground>
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
    backgroundColor: defaultTheme.colors.background
  },
  image: {
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
  },
  welcomeMobile: {
    marginHorizontal: 24,
    marginTop: 48
  },
  welcomeText: {
    color: PRIMARY_100,
    fontWeight: "700",
    fontSize: 45,
    lineHeight: 53
  },
  welcomeName: {
    color: PRIMARY_100,
    fontWeight: "500",
    fontSize: 28,
    lineHeight: 36
  }
});
