import React, { useEffect, useState } from "react";
import { DeviceEventEmitter, SafeAreaView, StatusBar } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import * as Screens from "../screens";
import locale from "../i18n/locale";
import User from "../stores/User";
import { isTablet } from "../../hook/isTablet";
import Navbar from "etendo-ui-library/dist-native/components/navbar/Navbar";
import { UserNoBorder } from "etendo-ui-library/dist-native/assets/images/icons/UserNoBorder";
import { ConfigurationIcon } from "etendo-ui-library/dist-native/assets/images/icons/ConfigurationIcon";
import { logout } from "../stores";
import { useNavigation } from "@react-navigation/native";
import { PRIMARY_100 } from "../styles/colors";
import styles from "./style";
import Drawer from "../components/Drawer";

export const DrawerNav = createDrawerNavigator();

export const AppLogin = () => {
  return (
    <>
      <SafeAreaView style={styles.containerBackground} />
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor={PRIMARY_100} />
        <DrawerNav.Navigator
          initialRouteName={"Login"}
          screenOptions={{ unmountOnBlur: true, headerShown: false }}
          drawerStyle={{ width: User.token ? "65%" : 0 }}
        >
          <DrawerNav.Screen
            name="Login"
            component={Screens.Login}
            options={{
              drawerLockMode: "locked-closed"
            }}
          />
          <DrawerNav.Screen
            name={"Settings"}
            component={Screens.Settings}
            options={{
              drawerLockMode: "locked-closed"
            }}
          />
        </DrawerNav.Navigator>
      </SafeAreaView>
    </>
  );
};
const computeDrawerWidth = () => {
  if (User.token) {
    return isTablet() ? "30%" : "65%";
  } else {
    return "0";
  }
};
export function AppHome({ props }) {
  const getActiveRouteName = (state) => {
    const route = state.routes[state.index];

    if (route.state) {
      // Dive into nested navigators
      return getActiveRouteName(route.state);
    }

    return route.name;
  };

  const [showNavbar, setShowNavbar] = useState<boolean>(true);

  const navigation = useNavigation();

  useEffect(() => {
    let listener = DeviceEventEmitter.addListener("showNavbar", (event) => {
      setShowNavbar(event.state);
    });

    return () => {
      listener.remove();
    };
  }, []);

  const onOptionPressHandle = async (route: string) => {
    if (route === "logout") {
      await logout();
    }
    navigation.navigate(route);
  };

  return (
    <>
      <SafeAreaView style={styles.containerBackground} />
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor={PRIMARY_100} />
        {showNavbar && (
          <Navbar
            title={locale.t("WelcomeToEtendoHome")}
            optionsProfile={[
              {
                title: locale.t("Profile"),
                image: <UserNoBorder />,
                route: "Profile"
              },
              {
                title: locale.t("Settings"),
                image: <ConfigurationIcon />,
                route: "Settings"
              }
            ]}
            endOptions={[
              {
                title: locale.t("Log out"),
                route: "logout"
              }
            ]}
            onOptionSelectedProfile={async (route: string) => {
              await onOptionPressHandle(route);
            }}
            name={User?.data?.username}
            onPressLogo={() => {
              setShowNavbar(true);
              navigation.navigate("Home");
            }}
          />
        )}
        <DrawerNav.Navigator
          initialRouteName={"Home"}
          screenOptions={{ unmountOnBlur: true, headerShown: false }}
          drawerContent={(props) => {
            return <Drawer {...props} />;
          }}
          drawerStyle={{ width: computeDrawerWidth() }}
        >
          <DrawerNav.Screen
            name="Home"
            component={Screens.Home}
            options={{
              drawerLockMode: "locked-closed"
            }}
          />
          <DrawerNav.Screen
            name={"Settings"}
            component={Screens.Settings}
            options={{
              drawerLockMode: "locked-closed"
            }}
          />

          <DrawerNav.Screen
            name={"Profile"}
            label={locale.t("Profile")}
            component={Screens.Profile}
            options={{
              drawerLockMode: "locked-closed"
            }}
          />
        </DrawerNav.Navigator>
      </SafeAreaView>
    </>
  );
}
