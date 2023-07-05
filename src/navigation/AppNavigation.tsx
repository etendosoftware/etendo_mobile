import React, { useContext, useEffect, useState } from "react";
import {
  createDrawerNavigator,
  useDrawerStatus
} from "@react-navigation/drawer";
import * as Screens from "../screens";
import { ContainerContext } from "../contexts/ContainerContext";
import { DrawerLateral } from "etendo-ui-library/dist-native/components/navbar";
import { DrawerCurrentIndexType } from "etendo-ui-library/dist-native/components/navbar/Navbar.types";
import { Etendo } from "../helpers/Etendo";
import { Drawer } from "../components";
import locale from "../i18n/locale";
import User from "../stores/User";
import { isTablet } from "../../hook/isTablet";
import MainScreen from "../components/MainScreen";

export const DrawerNav = createDrawerNavigator();

export function AppLogin() {
  return (
    <>
      <DrawerNav.Navigator
        initialRouteName={"Login"}
        screenOptions={{ unmountOnBlur: true, headerShown: false }}
        drawerStyle={{ width: User.token ? "65%" : 0 }}
      >
        <DrawerNav.Screen
          name="Login"
          component={Screens.Login}
          options={{
            drawerLockMode: "locked-closed",
            headerStyle: {
              backgroundColor: "#f4511e" // este cambiará el color del header
            }
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
    </>
  );
}
export function AppHome({ props }) {
  const context = useContext(ContainerContext);
  const [menuItemsDrawer, setMenuItemDrawer] = useState<any>([]);

  useEffect(() => {
    setMenuItemDrawer(context?.state?.menuItems);
    console.log(context?.state?.menuItems);
  }, [context?.state?.menuItems]);

  return (
    <DrawerNav.Navigator
      initialRouteName={"Home"}
      screenOptions={{ unmountOnBlur: true, headerShown: false }}
      drawerContent={(props) => {}}
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
