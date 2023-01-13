import React, { useContext } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import * as Screens from "../screens";
import { CardViewStackNavigator } from "./CardViewNavigator";
import { LoadingScreen, Drawer } from "../components";
import locale from "../i18n/locale";
import User from "../stores/User";
import MainScreen from "../components/MainScreen";
import { ContainerContext } from "../contexts/ContainerContext";
import { useNavigation } from "@react-navigation/native";
import { Etendo } from "../helpers/Etendo";

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
  const context = useContext(ContainerContext);

  return (
    <DrawerNav.Navigator
      initialRouteName={"Home"}
      screenOptions={{ unmountOnBlur: true, headerShown: false }}
      drawerContent={props => {
        return <Drawer {...props} />;
      }}
      drawerStyle={{ width: User.token ? "65%" : 0 }}
    >
      <DrawerNav.Screen
        name="Home"
        component={Screens.Home}
        options={{
          drawerLockMode: "locked-closed"
        }}
      />

      <DrawerNav.Screen
        name="Tutorial"
        component={Screens.Tutorial}
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

      <DrawerNav.Screen name="CardView1" component={CardViewStackNavigator} />
      {context?.state?.menuItems.map((menuItem: any) => {
        const params = { ...menuItem };
        if (params.component) {
          delete params.component;
        }
        return (
          <DrawerNav.Screen
            name={menuItem.name}
            component={menuItem.component ? menuItem.component : MainScreen}
            initialParams={params}
            options={{}}
          />
        );
      })}
    </DrawerNav.Navigator>
  );
}
