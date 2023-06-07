import React, { useContext, useState, useEffect } from "react";
import { View, Image, Text, Pressable } from "react-native";
import { User, Windows, logout } from "../../stores";
import { observer } from "mobx-react";
import { OBRest, Restrictions } from "obrest";
import { IRecord } from "../../types/Record";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import locale from "../../i18n/locale";
import { observe } from "mobx";
import Icon from "react-native-vector-icons/Ionicons";
import { defaultTheme } from "../../themes";
import ShowProfilePicture from "./../ShowProfilePicture";
import { ContainerContext } from "../../contexts/ContainerContext";
import { Etendo } from "../../helpers/Etendo";
import { INavigation, IRoute } from "../../interfaces";
import styles from "./styles";

interface Props {
  activeItemKey: object;
  activeTintColor: object;
  inactiveTintColor: object;
  onItemPress: object;
  getLabel: object;
  routes?: IRoute[];
  navigation: INavigation;
  context: any;
  state: {
    routes: IRoute[];
  };
}

const DrawerFunction = observer((props: Props) => {
  const [menuItems, setMenuItems] = useState([]);
  const [loadingMenu, setLoadingMenu] = useState(true);
  const [userName, setUserName] = useState("");
  const [organization, setOrganization] = useState("");

  useEffect(() => {
    const disposer = observe(Windows, (change) => {
      setLoadingMenu(!(Windows.menuItems.length > 0));
    });

    return () => disposer(); // cleanup observer when component unmounts
  }, []);

  useEffect(() => {
    const fetchOrganizationName = async () => {
      const organization = await getOrganizationName();
      setOrganization(organization);
      setLoadingMenu(menuItems.length === 0);
    };

    fetchOrganizationName();
  }, []); // run once after first render

  useEffect(() => {
    if (
      !Windows.loading &&
      !User.loading &&
      User.token &&
      menuItems !== Windows.menuItems
    ) {
      setMenuItems(Windows.menuItems);
      setUserName(User.data.username);
    }
  }, [Windows, User, menuItems]); // run whenever Windows, User, or menuItems changes

  const handleLogout = async () => {
    await logout();
    setMenuItems([]);
  };

  const getOrganizationName = async () => {
    let criteria = OBRest.getInstance().createCriteria("Organization");
    criteria.add(Restrictions.equals("id", User.data.organization));
    const org: IRecord = await criteria.uniqueResult();
    return org.name;
  };

  if (Windows.loading || !loadingMenu) {
    return null;
  }

  return (
    <DrawerContentScrollView {...props}>
      <View>
        <Image
          style={styles.image}
          source={require("../../../src/img/drawer.png")}
        />
        <View style={styles.topData}>
          <Pressable
            style={styles.pressableStyle}
            onPress={() => props.navigation.navigate("Profile")}
          >
            <ShowProfilePicture
              size={85}
              username={userName}
            ></ShowProfilePicture>
          </Pressable>
          <View style={styles.dataProfile}>
            <Text allowFontScaling={false} style={styles.textProfile}>
              {userName}
            </Text>
            <Text allowFontScaling={false} style={styles.textProfile}>
              {organization}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.constantItemsSecondary}>
        <Icon name="md-home" size={20} style={styles.iconColor} />
        <DrawerItem
          activeTintColor={defaultTheme.colors.textSecondary}
          inactiveTintColor={defaultTheme.colors.textSecondary}
          style={styles.drawerItem}
          key={0}
          labelStyle={styles.drawerText}
          label={locale.t("Home")}
          onPress={() => props.navigation.navigate("Home")}
        />
      </View>

      {props.context?.state?.menuItems.map((menuItem: any) => {
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
            onPress={async () => {
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
          activeTintColor={defaultTheme.colors.textSecondary}
          inactiveTintColor={defaultTheme.colors.textSecondary}
          labelStyle={styles.drawerText}
          style={styles.drawerItem}
          label={locale.t("Settings")}
          onPress={() => props.navigation.navigate("Settings")}
        />
      </View>
      <View style={styles.drawerItemsContainer}>
        <Icon name="md-log-out" size={20} style={styles.iconColor} />
        <DrawerItem
          activeTintColor={defaultTheme.colors.textSecondary}
          inactiveTintColor={defaultTheme.colors.textSecondary}
          style={styles.drawerItem}
          label={locale.t("Log out")}
          labelStyle={styles.drawerText}
          onPress={handleLogout}
        />
      </View>
    </DrawerContentScrollView>
  );
});

export const Drawer = (props) => {
  const context = useContext(ContainerContext);

  return <DrawerFunction {...props} context={context} />;
};
export default Drawer;
