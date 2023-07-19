import React, { useContext, useEffect, useState } from "react";
import MainAppContext from "../../contexts/MainAppContext";
import { ContainerContext } from "../../contexts/ContainerContext";
import { DrawerCurrentIndexType } from "etendo-ui-library/dist-native/components/navbar/Navbar.types";
import { SafeAreaView, StatusBar, View, Image } from "react-native";
import { PRIMARY_100 } from "../../styles/colors";
import Navbar from "etendo-ui-library/dist-native/components/navbar/Navbar";
import locale from "../../i18n/locale";
import Home from "../../screens/Home";
import Settings from "../../screens/Settings";
import Profile from "../../screens/Profile";
import DrawerLateral from "etendo-ui-library/dist-native/components/navbar/components/DrawerLateral/DrawerLateral";
import User from "../../stores/User";
import { UserNoBorder } from "etendo-ui-library/dist-native/assets/images/icons/UserNoBorder";
import { ConfigurationIcon } from "etendo-ui-library/dist-native/assets/images/icons/ConfigurationIcon";
import { logout } from "../../stores";
import pkg from "../../../package.json";
import {
  StackNavigationProp,
  createStackNavigator
} from "@react-navigation/stack";
import MainScreen from "../../components/MainScreen";
import styles from "./style";
import { useNavigationState } from "@react-navigation/native";
import { isTablet } from "../../helpers/IsTablet";
import { drawerData } from "./dataDrawer";

type RootStackParamList = {
  Home: any;
  Settings: any;
  Profile: any;
};

type HomeStackProps = {
  navigation: StackNavigationProp<RootStackParamList, "Home">;
};

const Stack = createStackNavigator<RootStackParamList>();

const HomeStack: React.FC<HomeStackProps> = ({ navigation }) => {
  const context = useContext(ContainerContext);
  const { setToken } = useContext(MainAppContext);
  const getActiveRouteName = (state: any): string => {
    if (!state.routes) return "";

    const route = state.routes[state.index];

    if (route.state) {
      return getActiveRouteName(route.state);
    }

    return route.name;
  };

  const routeName = getActiveRouteName(useNavigationState((state) => state));

  const [showNavbar, setShowNavbar] = useState<boolean>(true);
  const [showDrawer, setShowDrawer] = useState<boolean>(false);
  const [dataDrawer, setDataDrawer] = useState<any>([]);
  const [currentIndex, setCurrentIndex] = useState<DrawerCurrentIndexType>({
    indexSection: 0,
    indexSubSection: 0,
    indexSubSectionItem: 0
  });

  useEffect(() => {
    if (!isTablet()) {
      if (routeName === "Settings" || routeName === "Profile") {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
        setCurrentIndex({
          indexSection: 0,
          indexSubSection: 0,
          indexSubSectionItem: 0
        });
      }
    } else {
      if (
        routeName === "Settings" ||
        routeName === "Profile" ||
        routeName === "Home" ||
        routeName === "HomeStack"
      ) {
        console.log(routeName);
        setShowNavbar(true);
      } else {
        setShowNavbar(false);
      }
    }
    console.log({ routeName });
  }, [routeName]);

  useEffect(() => {
    const itemsDrawer = context?.state?.menuItems.map((item: any) => {
      return { route: item.name, label: item.name };
    });

    setDataDrawer(itemsDrawer);
  }, [context?.state?.menuItems]);

  const onOptionPressHandle = async (
    route: keyof RootStackParamList | "logout"
  ) => {
    if (route === "logout") {
      await logout();
      setToken(false);
      return;
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
            profileImage={
              context?.state?.bindaryImg && (
                <Image
                  source={{
                    uri: `data:image/jpeg;base64,${context?.state?.bindaryImg}`
                  }}
                />
              )
            }
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
            onOptionSelectedProfile={async (route?: string) => {
              await onOptionPressHandle(route as keyof RootStackParamList);
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
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name={"Settings"} component={Settings} />
          <Stack.Screen name={"Profile"} component={Profile} />
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
            data={drawerData(dataDrawer)}
            showDrawer={showDrawer}
            currentIndex={currentIndex}
            onOptionSelected={(
              route?: string,
              currentIndex?: DrawerCurrentIndexType
            ) => {
              setCurrentIndex(currentIndex);
              navigation.navigate(route as keyof RootStackParamList);
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
};

export default HomeStack;
