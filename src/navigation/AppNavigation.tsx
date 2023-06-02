import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import * as Screens from "../screens";
import { Drawer } from "../components";
import locale from "../i18n/locale";
import User from "../stores/User";
import { isTablet } from "../../hook/isTablet";

export const DrawerNav = createDrawerNavigator();

export function AppLogin() {
  return (
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
  );
}
export function AppHome() {
  return (
    <DrawerNav.Navigator
      initialRouteName={"Home"}
      screenOptions={{ unmountOnBlur: true, headerShown: false }}
      drawerContent={(props) => {
        return <Drawer {...props} />;
      }}
      drawerStyle={{ width: User.token ? (isTablet() ? "30%" : "65%") : 0 }}
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
  );
}
