import React, { useEffect, useState } from 'react';
import { DrawerCurrentIndexType } from 'etendo-ui-library/dist-native/components/navbar/Navbar.types';
import { SafeAreaView, StatusBar, View, Image } from 'react-native';
import { PRIMARY_100 } from '../../styles/colors';
import Navbar from 'etendo-ui-library/dist-native/components/navbar/Navbar';
import locale from '../../i18n/locale';
import Home from '../../screens/Home';
import Settings from '../../screens/Settings';
import Profile from '../../screens/Profile';
import DrawerLateral from 'etendo-ui-library/dist-native/components/navbar/components/DrawerLateral/DrawerLateral';
import { UserIcon } from 'etendo-ui-library/dist-native/assets/images/icons';
import pkg from '../../../package.json';
import {
  StackNavigationProp,
  createStackNavigator,
} from '@react-navigation/stack';
import MainScreen from '../../components/MainScreen';
import styles from './style';
import { useFocusEffect, useNavigationState } from '@react-navigation/native';
import { isTablet } from '../../helpers/IsTablet';
import { drawerData } from './dataDrawer';
import { selectBindaryImg, selectData } from '../../../redux/user';
import { useAppDispatch, useAppSelector } from '../../../redux';
import { useUser } from '../../../hook/useUser';
import { selectMenuItems, setIsSubapp } from '../../../redux/window';
import {
  changeLanguage,
  languageCurrentInitialize,
} from '../../helpers/getLanguajes';
import { SettingIcon } from 'etendo-ui-library';

type RootStackParamList = {
  Home: any;
  Settings: any;
  Profile: any;
};

type HomeStackProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Home'>;
};

const Stack = createStackNavigator<RootStackParamList>();

const HomeStack: React.FC<HomeStackProps> = ({ navigation }) => {
  const data = useAppSelector(selectData);
  const menuItems = useAppSelector(selectMenuItems);
  const bindaryImg = useAppSelector(selectBindaryImg);
  const dispatch = useAppDispatch();

  const { logout } = useUser();
  const getActiveRouteName = (state: any): string => {
    if (!state.routes) return '';

    const route = state.routes[state.index];

    if (route.state) {
      return getActiveRouteName(route.state);
    }

    return route.name;
  };

  const routeName = getActiveRouteName(useNavigationState(state => state));

  const [showNavbar, setShowNavbar] = useState<boolean>(true);
  const [showDrawer, setShowDrawer] = useState<boolean>(false);
  const [dataDrawer, setDataDrawer] = useState<any>([]);
  const [currentIndex, setCurrentIndex] = useState<DrawerCurrentIndexType>({
    indexSection: 0,
    indexSubSection: 0,
    indexSubSectionItem: 0,
  });
  const validRoutesTablet = ['Settings', 'Profile', 'Home', 'HomeStack'];
  const validRoutesMobile = ['Home', 'HomeStack'];

  const homeStackNavBarTabletValidator = (routeName: string) => {
    return validRoutesTablet.includes(routeName);
  };

  const homeStackNavBarMobileValidator = (routeName: string) => {
    return validRoutesMobile.includes(routeName);
  };

  const { setCurrentLanguage } = useUser();

  useFocusEffect(() => {
    if (languageCurrentInitialize.get()) {
      const getLanguageLocal = async () => {
        await changeLanguage(
          languageCurrentInitialize.get(),
          setCurrentLanguage(languageCurrentInitialize.get()),
        );
      };
      locale.initTranslation();

      getLanguageLocal();
    }
  });

  useEffect(() => {
    if (!isTablet()) {
      if (homeStackNavBarMobileValidator(routeName)) {
        setShowNavbar(true);
        setCurrentIndex({
          indexSection: 0,
          indexSubSection: 0,
          indexSubSectionItem: 0,
        });
      } else {
        setShowNavbar(false);
      }
    } else {
      if (homeStackNavBarTabletValidator(routeName)) {
        console.log(routeName);
        setShowNavbar(true);
      } else {
        setShowNavbar(false);
      }
    }
  }, [routeName]);

  useEffect(() => {
    if (menuItems) {
      const itemsDrawer = menuItems.map((item: any) => {
        return { route: item.name, label: item.name };
      });

      setDataDrawer(itemsDrawer);
      dispatch(setIsSubapp(false));
    }
  }, [menuItems]);

  const onOptionPressHandle = async (
    route: keyof RootStackParamList | 'logout',
  ) => {
    if (route === 'logout') {
      await logout();
      return;
    }
    navigation.navigate(route);
  };

  return (
    <>
      <SafeAreaView style={styles.containerBackground} />
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={PRIMARY_100} />
        {showNavbar && (
          <Navbar
            title={locale.t('WelcomeToEtendoHome')}
            isVisibleMenu={showNavbar}
            profileImage={
              bindaryImg && (
                <Image
                  source={{
                    uri: `data:image/jpeg;base64,${bindaryImg}`,
                  }}
                />
              )
            }
            profileOptions={[
              {
                title: locale.t('Profile'),
                image: <UserIcon />,
                route: 'Profile',
              },
              {
                title: locale.t('Settings'),
                image: <SettingIcon />,
                route: 'Settings',
              },
            ]}
            endOptions={[
              {
                title: locale.t('Log out'),
                route: 'logout',
              },
            ]}
            onOptionSelectedProfile={async (route?: string) => {
              await onOptionPressHandle(route as keyof RootStackParamList);
            }}
            name={data?.username}
            onPressLogo={() => {
              navigation.navigate('Home');
            }}
            onPressMenu={() => {
              setShowDrawer(true);
            }}
          />
        )}
        <Stack.Navigator
          initialRouteName={'Home'}
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name={'Settings'} component={Settings} />
          <Stack.Screen name={'Profile'} component={Profile} />
          {menuItems && menuItems.length ? (
            menuItems?.map((menuItem: any, index: number) => {
              const params = { ...menuItem };
              if (params.component) {
                delete params.component;
              }
              return (
                <Stack.Screen
                  key={'drawerItems' + index}
                  name={menuItem.name}
                  component={
                    menuItem.component ? menuItem.component : MainScreen
                  }
                  initialParams={params}
                />
              );
            })
          ) : (
            <></>
          )}
        </Stack.Navigator>
        <View>
          <DrawerLateral
            data={drawerData(dataDrawer)}
            showDrawer={showDrawer}
            currentIndex={currentIndex}
            onOptionSelected={(
              route?: string,
              currentIndex?: DrawerCurrentIndexType,
            ) => {
              setCurrentIndex(currentIndex);
              navigation.navigate(route as keyof RootStackParamList);
              setShowDrawer(false);
              dispatch(setIsSubapp(true));
            }}
            onCloseDrawer={() => {
              setShowDrawer(false);
            }}
            copyright={'Copyright @ 2024 Etendo'}
            version={pkg.version}
          />
        </View>
      </SafeAreaView>
    </>
  );
};

export default HomeStack;
