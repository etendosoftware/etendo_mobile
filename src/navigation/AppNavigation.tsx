import React, { useEffect, useState } from "react";
import {
  DeviceEventEmitter,
  Image,
  Platform,
  StatusBar,
  View
} from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import * as Screens from "../screens";
import { Drawer } from "../components";
import locale from "../i18n/locale";
import User from "../stores/User";
import { isTablet } from "../../hook/isTablet";
import Navbar from "etendo-ui-library/dist-native/components/navbar/Navbar";
import { UserNoBorder } from "etendo-ui-library/dist-native/assets/images/icons/UserNoBorder";
import { ConfigurationIcon } from "etendo-ui-library/dist-native/assets/images/icons/ConfigurationIcon";
import { logout } from "../stores";
import { NEUTRAL_100, PRIMARY_100 } from "../styles/colors";
import { useNavigation } from "@react-navigation/native";

export const DrawerNav = createDrawerNavigator();

export const AppLogin = () => {
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
};
const computeDrawerWidth = () => {
  if (User.token) {
    return isTablet() ? "30%" : "65%";
  } else {
    return "0";
  }
};

const getActiveRouteName = (state) => {
  const route = state.routes[state.index];

  if (route.state) {
    // Dive into nested navigators
    return getActiveRouteName(route.state);
  }

  return route.name;
};

export const AppHome = (props) => {
  const [profileImage, setProfileImage] = useState<any>([]);
  const [showNavbar, setShowNavbar] = useState<boolean>(true);

  const navigation = useNavigation();

  useEffect(() => {
    let listener = DeviceEventEmitter.addListener("goBack", (e) => {
      setShowNavbar(true);
    });

    return () => {
      listener.remove();
    };
  }, []);

  const onOptionPressHandle = async (route: string) => {
    if (route === "logout") {
      await logout();
    }
    if (!isTablet()) {
      setShowNavbar(false);
    }
    navigation.navigate(route);
  };

  return (
    <>
      <View
        style={{
          height: Platform.OS === "android" ? StatusBar.currentHeight : 0,
          backgroundColor: showNavbar ? PRIMARY_100 : NEUTRAL_100
        }}
      ></View>
      {showNavbar && (
        <Navbar
          optionsProfile={[
            {
              title: "Profile",
              image: <UserNoBorder />,
              route: "Profile"
            },
            {
              title: "Settings",
              image: <ConfigurationIcon />,
              route: "Settings"
            }
          ]}
          onOptionSelectedProfile={async (route: string) => {
            await onOptionPressHandle(route);
          }}
          name={User?.data?.username}
          profileImage={
            profileImage.length && (
              <Image
                source={{
                  uri: `data:image/jpeg;base64,${profileImage[0].bindaryData}`
                }}
              />
            )
          }
          onPressLogo={() => {
            setShowNavbar(true);
            navigation.navigate("Home");
          }}
          onPressMenuBurger={() => {}}
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
    </>
  );
};
