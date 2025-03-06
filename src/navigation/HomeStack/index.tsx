import React, { useEffect, useState } from 'react';
import { DrawerCurrentIndexType } from 'etendo-ui-library/dist-native/components/navbar/Navbar.types';
import { SafeAreaView, StatusBar, View, Image, Linking } from 'react-native';
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
import { selectMenuItems, setIsSubapp, setMenuItems } from '../../../redux/window';
import {
  changeLanguage,
  languageCurrentInitialize,
} from '../../helpers/getLanguajes';
import { generateUniqueId } from '../../utils';
import { SettingIcon } from 'etendo-ui-library';
import { setSharedFiles } from '../../../redux/shared-files-reducer';

type RootStackParamList = {
  Home: any;
  Settings: any;
  Profile: any;
  MainScreen: any;
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

  const { logout, setCurrentLanguage } = useUser();

  const getActiveRouteName = (state: any): string => {
    if (!state.routes) return '';

    const route = state.routes[state.index];

    if (route.state) {
      return getActiveRouteName(route.state);
    }

    return route.name;
  };

  const routeName = getActiveRouteName(useNavigationState(state => state));

  const [subApps, setSubApps] = useState([]);
  const [selectedSubApp, setSelectedSubApp] = useState<any>(null);
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

  useFocusEffect(() => {
    if (languageCurrentInitialize.get()) {
      const getLanguageLocal = async () => {
        await changeLanguage(languageCurrentInitialize.get());
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
      const itemsDrawer = menuItems.map((item, index) => {
        const uniqueId = generateUniqueId(item.name);
        return {
          ...item,
          label: item.name,
          route: uniqueId,
          screenName: item.name,
          uniqueId: uniqueId,
        };
      });

      setSubApps(itemsDrawer);

      setDataDrawer(
        itemsDrawer.map(item => ({
          route: item.screenName,
          label: item.name,
        })),
      );

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

    // Find the subApp using the screenName
    const subAppToNavigate = subApps.find(app => app.screenName === route);

    if (subAppToNavigate) {
      navigation.navigate(subAppToNavigate.screenName);
    } else {
      navigation.navigate(route);
    }
  };

  // Secondary effect to handle deep linking
  useEffect(() => {
    const handleUrl = (event) => {
      const url = event.url;
      const queryString = url.split('?')[1];

      const params = {};
      if (queryString) {
        const queryParts = queryString.split('&');
        queryParts.forEach(part => {
          const [key, value] = part.split('=');
          params[decodeURIComponent(key)] = decodeURIComponent(value || '');
        });
      }

      const subApplication = params['subApplication'];
      const subAppPath = params['path'];

      if (subApplication && subAppPath) {
        setSelectedSubApp({ name: subApplication, path: subAppPath });
      }
    };

    Linking.addEventListener('url', handleUrl);

    Linking.getInitialURL().then((url) => {
      if (url) {
        handleUrl({ url });
      }
    });
  }, []);

  // Navigate to the selected subApp
  useEffect(() => {
    if (selectedSubApp && subApps.length > 0) {
      const targetSubApp = subApps.find(
        subApp => subApp.name === selectedSubApp.name
      );
      if (targetSubApp) {
        navigation.navigate(targetSubApp.screenName, {
          path: selectedSubApp.path,
        });
      }
    }
  }, [selectedSubApp, subApps]);

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
          <Stack.Screen name={'Home'} component={Home} initialParams={{ subApps: subApps }} />
          <Stack.Screen name={'Settings'} component={Settings} />
          <Stack.Screen name={'Profile'} component={Profile} />
          <Stack.Screen name={'MainScreen'} component={MainScreen} />
          {subApps && subApps.length ? (
            subApps?.map((subApp: any, index: number) => {
              const params = { ...subApp };
              if (params.component) {
                delete params.component;
              }
              return (
                <Stack.Screen
                  key={'drawerItems' + subApp.uniqueId}
                  name={subApp.screenName as any}
                  component={subApp.component ? subApp.component : MainScreen}
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
              dispatch(setSharedFiles([]))
            }}
            onCloseDrawer={() => {
              setShowDrawer(false);
            }}
            copyright={'Copyright @ 2025 Etendo'}
            version={pkg.version}
          />
        </View>
      </SafeAreaView>
    </>
  );
};

export default HomeStack;
