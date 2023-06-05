import React from "react";
import {
  Dimensions,
  Image,
  View,
  Text,
  ImageBackground,
  StatusBar
} from "react-native";
import withAuthentication from "../../withAuthentication";
import { observer } from "mobx-react";
import { INavigation } from "../../components/Card";
import { isTablet } from "../../../hook/isTablet";
import { useNavigation } from "@react-navigation/native";
import { Etendo } from "../../helpers/Etendo";
import { Navbar } from "../../../ui/components";
import { ContainerContext } from "../../contexts/ContainerContext";
import { ConfigurationIcon } from "../../ui/assets/images/icons/ConfigurationIcon";
import { OBRest, Restrictions } from "obrest";
import { User, logout } from "../../stores";
import locale from "../../i18n/locale";
import { styles } from "./style";
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
@observer
class HomeClass extends React.Component<Props, State> {
  static contextType = ContainerContext;
  constructor(props) {
    super(props);
    this.state = {
      image: null,
      getImage: false
    };
  }

  async componentDidUpdate(): Promise<void> {
    if (!this.state.getImage) {
      console.log("a");
      this.setState({ image: await this.getImage() });
    }
  }

  getImage = async () => {
    let imageIdCriteria = OBRest.getInstance().createCriteria("ADUser");
    imageIdCriteria.add(Restrictions.equals("id", User.data.userId));
    let user: any = await imageIdCriteria.uniqueResult();
    this.setState({ getImage: true });
    let imageCriteria = OBRest.getInstance().createCriteria("ADImage");
    imageCriteria.add(Restrictions.equals("id", user.image));
    let image: any = await imageCriteria.list();
    return image;
  };

  onOptionPressHandle = (route: string) => {
    if (route === "logout") {
      return this.handleLogout();
    }
    this.props.navigation.navigate(route);
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
            this.onOptionPressHandle(route);
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
          onPressLogo={() => {}}
          onPressMenuBurger={() => {}}
        />
        {isTablet() ? (
          <View horizontal style={styles.conteinerMed}></View>
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
    );
  }
}
const Home = (props) => {
  const navigation = useNavigation();
  Etendo.globalNav = navigation;
  return <HomeClass {...props} />;
};
export default withAuthentication(Home);
