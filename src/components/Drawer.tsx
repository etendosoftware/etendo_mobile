import React, { useContext } from "react";
import {
  View,
  Image,
  Dimensions,
  StyleSheet,
  Text,
  Pressable,
} from "react-native";
import { User, Windows, logout } from "../stores";
import { DefaultTheme } from "react-native-paper";
import { observer } from "mobx-react";
import { OBRest, Restrictions } from "etrest";
import { IRecord } from "../types/Record";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { INavigation } from "./Card";
import locale from "../i18n/locale";
import { observe } from "mobx";
import Icon from "react-native-vector-icons/Ionicons";
import { defaultTheme } from "../themes";
import ShowProfilePicture from "./ShowProfilePicture";
import { ContainerContext } from "../contexts/ContainerContext";
import { Etendo } from "../helpers/Etendo";

const NOAUTH_SCREENS = ["Settings", "Login"];

interface IRoute {
  name: string;
  key: string;
  label: string;
  reset?: boolean;
  params: {
    key: string;
  }[];
}
interface Props {
  activeItemKey: object;
  activeTintColor: object;
  inactiveTintColor: object;
  onItemPress: object;
  getLabel: object;
  routes?: IRoute[];
  navigation: INavigation;
  state: {
    routes: IRoute[];
  };
}

interface State {
  menuItems: IRoute[];
  loadingMenu: boolean;
  userName: string;
  organization: string;
}

const win = Dimensions.get("window");
const ratio = win.width / 1080; //541 is actual image width

@observer
export class DrawerClass extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      menuItems: [],
      loadingMenu: true,
      userName: "",
      organization: ""
    };
    observe(Windows, (change) => {
      let loading = true;
      if (Windows.menuItems.length > 0) {
        loading = false;
      }
      if (this.state.loadingMenu !== loading) {
        this.setState({ loadingMenu: loading });
      }
    });
  }
  componentDidUpdate = (_, prevState) => {
    let newMenuItems = Windows.menuItems;
    if (
      !Windows.loading &&
      !User.loading &&
      User.token &&
      prevState.menuItems != newMenuItems
    ) {
      // not loading but logged in, and menus are not loaded
      this.setState({ menuItems: newMenuItems, userName: User.data.username });
    }
  };
  componentDidMount = async () => {
    
    const organization = await this.getOrganizationName();
    this.setState({ organization });
    if (this.state.menuItems === []) {
      this.setState({ loadingMenu: true });
    } else {
      this.setState({ loadingMenu: false });
    }
  };

  handleLogout = async () => {
    await logout();
    this.setState({ menuItems: [] });
  };

  noAuthenticationScreens = screen => {
    return NOAUTH_SCREENS.includes(screen.key);
  };

  getInitials = function(string) {
    var names = string.split(" "),
      initials = names[0].substring(0, 1).toUpperCase();
    if (names.length > 1) {
      initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }
    return initials;
  };

  getOrganizationName = async () => {
    let criteria = OBRest.getInstance().createCriteria("Organization");
    criteria.add(Restrictions.equals("id", User.data.organization));
    var org: IRecord = await criteria.uniqueResult();
    return org.name;
  };

  render() {
    if (Windows.loading) {
      return null;
    }
    var focused = false;
    return (
      <DrawerContentScrollView {...this.props}>
        <View>
          <Image
            style={styles.image}
            source={require("../../src/img/drawer.png")}
          />
          <View style={styles.topData}>
            <Pressable
              style={styles.pressableStyle}
              onPress={() => this.props.navigation.navigate("Profile")}
            >
              <ShowProfilePicture
                size={85}
                username={this.state.userName}
              ></ShowProfilePicture>
            </Pressable>
            <View style={styles.dataProfile}>
              <Text allowFontScaling={false} style={styles.textProfile}>
                {this.state.userName}
              </Text>
              <Text allowFontScaling={false} style={styles.textProfile}>
                {this.state.organization}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.constantItemsSecondary}>
          <Icon name="md-home" size={20} style={styles.iconColor} />
          <DrawerItem
            activeTintColor={DefaultTheme.colors.textSecondary}
            inactiveTintColor={DefaultTheme.colors.textSecondary}
            style={styles.drawerItem}
            key={0}
            labelStyle={styles.drawerText}
            label={locale.t("Home")}
            onPress={() => this.props.navigation.navigate("Home")}
          />
        </View>

        {this.props.context?.state?.menuItems.map((menuItem: any) => {
          const params = { ...menuItem };
          if (params.component) {
            delete params.component;
          }
          return (
            <DrawerItem
              activeTintColor={"black"}
              inactiveTintColor={"black"}
              key={menuItem.__id}
              label={menuItem.name}
              labelStyle={styles.drawerText}
              style={styles.drawerItem}
          onPress={async() => {
                if (menuItem.app) {
                  Etendo.navigation[menuItem.app].navigate(
                    menuItem.route,
                    menuItem
                  );
                  Etendo.toggleDrawer();
                } else {
                  Etendo.globalNav.navigate(menuItem.name, menuItem.params);
                }
              }}
            />
          );
        })}
        <View style={styles.constantItems}></View>
        <View style={styles.drawerItemsContainer}>
          <Icon name="md-settings" size={20} style={styles.iconColor} />
          <DrawerItem
            activeTintColor={DefaultTheme.colors.textSecondary}
            inactiveTintColor={DefaultTheme.colors.textSecondary}
            labelStyle={styles.drawerText}
            style={styles.drawerItem}
            label={locale.t("Settings")}
            onPress={() => this.props.navigation.navigate("Settings")}
          />
        </View>
        <View style={styles.drawerItemsContainer}>
          <Icon name="md-log-out" size={20} style={styles.iconColor} />
          <DrawerItem
            activeTintColor={DefaultTheme.colors.textSecondary}
            inactiveTintColor={DefaultTheme.colors.textSecondary}
            style={styles.drawerItem}
            label={locale.t("Log out")}
            labelStyle={styles.drawerText}
            onPress={this.handleLogout}
          />
        </View>
      </DrawerContentScrollView>
    );
  }
}

export const Drawer = (props) => {
  const context = useContext(ContainerContext);

  return <DrawerClass {...props} context={context} />;
};
export default Drawer;

const styles = StyleSheet.create({
  image: {
    flex: 1,
    alignSelf: "stretch",
    width: "100%",
    height: 150,
    position: "relative"
  },
  topData: {
    position: "absolute",
    padding: 5,
    width: "100%",
    height: "50%",
    alignContent: "center",
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-evenly",
    marginTop: 10
  },
  pressableStyle: {
    marginTop: 30,
    width: 85
  },
  dataProfile: {
    width: "50%",
    height: "30%"
  },
  textProfile: {
    fontWeight: "bold",
    color: defaultTheme.colors.textSecondary,
    fontSize: 15
  },
  constantItems: {
    borderStyle: "solid",
    borderColor: defaultTheme.colors.textSecondary,
    borderTopWidth: 0.5,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10
  },
  constantItemsSecondary: {
    borderStyle: "solid",
    borderColor: defaultTheme.colors.textSecondary,
    borderBottomWidth: 0.5,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10
  },
  viewPlaceholder: {
    margin: 20
  },
  drawerItemsContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10
  },
  drawerItem: {
    width: "80%"
  },
  iconColor: {
    color: defaultTheme.colors.textSecondary
  },
  drawerText: {
    color: defaultTheme.colors.textSecondary,
    fontSize: 15
  }
});
