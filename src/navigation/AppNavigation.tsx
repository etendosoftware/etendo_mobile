import React, { useContext, useEffect, useState } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import * as Screens from "../screens";
import { ContainerContext } from "../contexts/ContainerContext";
import locale from "../i18n/locale";
import User from "../stores/User";
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

  return (
    <DrawerNav.Navigator
      initialRouteName={"Home"}
      screenOptions={{ unmountOnBlur: true, headerShown: false }}
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
