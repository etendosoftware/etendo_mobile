import React, { useContext, useEffect, useState } from "react";
import {
  createDrawerNavigator,
  useDrawerStatus
} from "@react-navigation/drawer";
import * as Screens from "../screens";
import { CardViewStackNavigator } from "./CardViewNavigator";
import locale from "../i18n/locale";
import User from "../stores/User";
import MainScreen from "../components/MainScreen";
import { ContainerContext } from "../contexts/ContainerContext";
import { DrawerLateral } from "../../ui/src/components/navbar";
import { DrawerCurrentIndexType } from "../../ui/src/components/navbar/Navbar.types";
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
export function AppHome({ props }) {
  const [routes, setRoutes] = useState<any>([]);
  const context = useContext(ContainerContext);
  const isDrawerOpen = () => {
    const drawerStatus = useDrawerStatus();

    if (drawerStatus === "open") {
      return true;
    }
    return false;
  };
  useEffect(() => {
    setRoutes(getRoutes());
  }, [context?.state?.menuItems.length]);

  const getRoutes = () => {
    return context?.state?.menuItems.map((item) => {
      return { label: item.name, route: item.name };
    });
  };

  return (
    <DrawerNav.Navigator
      initialRouteName={"Home"}
      screenOptions={{ unmountOnBlur: true, headerShown: false }}
      drawerContent={(props) => {
        return (
          <DrawerLateral
            version=""
            copyright=""
            data={{
              content: [
                {
                  sectionType: "sections",
                  titleSection: "Aplications",
                  dataSection: routes
                }
              ]
            }}
            showDrawer={isDrawerOpen()}
            onOptionSelected={(
              route?: string,
              currentIndex?: DrawerCurrentIndexType
            ) => {
              props.navigation.navigate(route);
            }}
            onCloseDrawer={() => {
              Etendo.closeDrawer();
            }}
          />
        );
      }}
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
