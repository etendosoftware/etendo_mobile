import React, { useContext, useEffect, useState } from "react";
import {
  DeviceEventEmitter,
  SafeAreaView,
  StatusBar,
  View
} from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import * as Screens from "../screens";
import locale from "../i18n/locale";
import User from "../stores/User";
import Navbar from "etendo-ui-library/dist-native/components/navbar/Navbar";
import { UserNoBorder } from "etendo-ui-library/dist-native/assets/images/icons/UserNoBorder";
import { ConfigurationIcon } from "etendo-ui-library/dist-native/assets/images/icons/ConfigurationIcon";
import { logout } from "../stores";
import { useNavigation } from "@react-navigation/native";
import { PRIMARY_100 } from "../styles/colors";
import styles from "./style";
import DrawerLateral from "etendo-ui-library/dist-native/components/navbar/components/DrawerLateral/DrawerLateral";
import pkg from "../../package.json";
import { DrawerCurrentIndexType } from "etendo-ui-library/dist-native/components/navbar/Navbar.types";
import { ContainerContext } from "../contexts/ContainerContext";
import MainScreen from "../components/MainScreen";
import { HomeIcon } from "etendo-ui-library/dist-native/assets/images/icons/HomeIcon";

const Stack = createStackNavigator();

export const AppLogin = () => {
  return (
    <>
      <SafeAreaView style={styles.containerBackground} />
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor={PRIMARY_100} />
        <Stack.Navigator
          initialRouteName={"Login"}
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Login" component={Screens.Login} />
          <Stack.Screen name={"Settings"} component={Screens.Settings} />
        </Stack.Navigator>
      </SafeAreaView>
    </>
  );
};

export function AppHome() {
  const context = useContext(ContainerContext);

  const getActiveRouteName = (state) => {
    const route = state.routes[state.index];

    if (route.state) {
      // Dive into nested navigators
      return getActiveRouteName(route.state);
    }

    return route.name;
  };

  const [showNavbar, setShowNavbar] = useState<boolean>(true);
  const [showDrawer, setShowDrawer] = useState<boolean>(false);
  const [dataDrawer, setDataDrawer] = useState<any>([]);

  const navigation = useNavigation();

  useEffect(() => {
    let listener = DeviceEventEmitter.addListener("showNavbar", (event) => {
      setShowNavbar(event.state);
    });

    return () => {
      listener.remove();
    };
  }, []);

  useEffect(() => {
    const itemsDrawer = context?.state?.menuItems.map((item: any) => {
      return { route: item.name, label: item.name };
    });

    setDataDrawer(itemsDrawer);
  }, [context?.state?.menuItems]);

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
              navigation.navigate("Home");
            }}
            onPressMenuBurger={() => {
              setShowDrawer(true);
            }}
          />
        )}
        <Stack.Navigator
          initialRouteName={"Home"}
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Home" component={Screens.Home} />
          <Stack.Screen name={"Settings"} component={Screens.Settings} />
          <Stack.Screen name={"Profile"} component={Screens.Profile} />
          {context?.state?.menuItems.map((menuItem: any, index: number) => {
            const params = { ...menuItem };
            if (params.component) {
              delete params.component;
            }
            return (
              <Stack.Screen
                key={"drawerItems" + index}
                name={menuItem.name}
                component={menuItem.component ? menuItem.component : MainScreen}
                initialParams={params}
              />
            );
          })}
        </Stack.Navigator>
        <View>
          <DrawerLateral
            data={[
              {
                sectionType: "sections",
                dataSection: [
                  { route: "Home", label: "Home", image: <HomeIcon /> }
                ]
              },
              {
                sectionType: "sections",
                dataSection: dataDrawer,
                titleSection: "Applications"
              }
            ]}
            showDrawer={showDrawer}
            currentIndex={{
              indexSection: 0,
              indexSubSection: 0,
              indexSubSectionItem: 0
            }}
            onOptionSelected={(
              route?: string,
              currentIndex?: DrawerCurrentIndexType
            ) => {
              navigation.navigate(route);
              setShowDrawer(false);
            }}
            onCloseDrawer={() => {
              setShowDrawer(false);
            }}
            copyright={"Copyright @ 2023 Etendo"}
            version={pkg.version}
          />
        </View>
      </SafeAreaView>
    </>
  );
}
