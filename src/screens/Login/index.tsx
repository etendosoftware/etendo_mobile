// Importing required modules and libraries
import React, { useEffect, useState } from 'react';
import { View, Image, TouchableOpacity, Dimensions } from 'react-native';
import locale from '../../i18n/locale';
import { Dialog, Text, Button } from 'react-native-paper';
import { Snackbar } from '../../globals';
import { Version } from '../../ob-api/objects';
import { formatEnvironmentUrl, getUrl, setUrl as setUrlOB } from '../../ob-api/ob';
import { defaultTheme } from '../../themes';
import ButtonUI from 'etendo-ui-library/dist-native/components/button/Button';
import { show } from 'etendo-ui-library/dist-native/components/alert/AlertManager';
import { isTablet, isTabletSmall } from '../../helpers/IsTablet';
import styleSheet from './styles';
import { deviceStyles as styles } from './deviceStyles';
import { References } from '../../constants/References';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useUser } from '../../../hook/useUser';
import { useAppSelector, useAppDispatch } from '../../../redux';
import {
  selectData,
  selectSelectedUrl,
  setContextPathUrl,
  setSelectedEnvironmentUrl,
  setSelectedUrl,
  setStoredEnviromentsUrl,
} from '../../../redux/user';
import {
  setIsDemo,
  setLoadingScreen,
  setError,
  selectError,
} from '../../../redux/window';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getContextPath, internetIsAvailable } from '../../utils';
import { OBRest } from 'etrest';
import { SettingIcon, TextInput } from 'etendo-ui-library';
import PasswordInput from 'etendo-ui-library/dist-native/components/inputBase/password-input/PasswordInput'

// Constants
const MIN_CORE_VERSION = '3.0.202201';
const windowDimensions = Dimensions.get('window');
const url = getUrl();

const deviceIsATablet = isTablet();
const deviceIsATabletSmall = isTabletSmall();

const { AdminUsername, AdminPassword } = References;
const backgroundTabletImg = require('../../img/tablet-background.png');
const backgroundMobileImg = require('../../img/background.png');

// Main functional component of the Login screen
const LoginFunctional = props => {
  // Initializing the state variables
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [coreVersion, setCoreVersion] = useState<string>('');
  const [showChangePassword, setShowChangePassword] = useState<boolean>(false);

  const data = useAppSelector(selectData);
  const error = useAppSelector(selectError);
  const dispatch = useAppDispatch();
  const selectedUrl = useAppSelector(selectSelectedUrl);
  const { login, logout, getImageProfile } = useUser();

  let listViewRef: KeyboardAwareScrollView;

  const validateCredentials = () => {
    return (
      username === AdminUsername &&
      password === AdminPassword &&
      url.toString() === References.DemoUrl
    );
  };

  const submitLogin = async () => {
    try {
      if (!(await internetIsAvailable())) {
        show(locale.t('NoInternetConnection'), 'error');
        return;
      }

      try {
        if (!selectedUrl) {
          throw new Error('LoginScreen:URLNotFound');
        }
        if (validateCredentials()) {
          demo();
        }
        dispatch(setError(false));
        const isCredentialsValid = await checkCredentials(username, password);
        if (!isCredentialsValid) {
          show(locale.t('ErrorUserPassword'), 'error');
          return;
        }

        dispatch(setLoadingScreen(true));
        await login(username, password);
        const isCoreVersionBeingChecked = await checkCoreCompatibility();
        if (!isCoreVersionBeingChecked) {
          await getImageProfile(data);
        }
      } catch (error) {
        dispatch(setError(true));
        dispatch(setLoadingScreen(false));
        if (error.message.includes('Invalid user name or password')) {
          show(locale.t('ErrorUserPassword'), 'error');
        }
        if (error.message.includes('OBRest instance not initialized')) {
          show(locale.t('LoginScreen:URLNotFound'), 'error');
        } else if (error.message.includes('Network Error')) {
          show(locale.t('LoginScreen:NetworkError'), 'error');
        } else {
          show(error.message, 'error');
        }
      }
    } catch (error) {
      Snackbar.showError(error.message);
      console.error(error);
      dispatch(setLoadingScreen(false));
    } finally {
      dispatch(setLoadingScreen(false));
    }
  };

  const checkCredentials = async (username, password) => {
    try {
      await OBRest.loginWithUserAndPassword(username, password);
      return true;
    } catch (error) {
      return false;
    }
  };

  const checkCoreCompatibility = async () => {
    const newCoreVersion = (await Version.getVersion()).data[0].coreVersion;
    const shouldShowUpdateDialog =
      versionCompare(MIN_CORE_VERSION, coreVersion) > 0;
    setCoreVersion(newCoreVersion);
    return shouldShowUpdateDialog;
  };

  const versionCompare = (v1: any, v2: any, options?: any) => {
    let lexicographical = options && options.lexicographical,
      zeroExtend = options && options.zeroExtend,
      v1parts = v1.split('.'),
      v2parts = v2.split('.');
    function isValidPart(x: string) {
      return (lexicographical ? /^\d+[A-Za-z]*$/ : /^\d+$/).test(x);
    }
    if (!v1parts.every(isValidPart) || !v2parts.every(isValidPart)) {
      return NaN;
    }
    if (zeroExtend) {
      while (v1parts.length < v2parts.length) v1parts.push('0');
      while (v2parts.length < v1parts.length) v2parts.push('0');
    }
    if (!lexicographical) {
      v1parts = v1parts.map(Number);
      v2parts = v2parts.map(Number);
    }
    for (let i = 0; i < v1parts.length; ++i) {
      if (v2parts.length == i) {
        return 1;
      }
      if (v1parts[i] == v2parts[i]) {
        continue;
      } else if (v1parts[i] > v2parts[i]) {
        return 1;
      } else {
        return -1;
      }
    }
    if (v1parts.length != v2parts.length) {
      return -1;
    }
    return 0;
  };

  const demo = async () => {
    try {
      if (!(await internetIsAvailable())) {
        show(locale.t('NoInternetConnection'), 'error');
        return;
      }

      dispatch(setLoadingScreen(true));

      const demoFullUrl = References.DemoUrl;
      const formattedEnvUrl = formatEnvironmentUrl(demoFullUrl);
      const contextPath = getContextPath(demoFullUrl);

      await setUrlOB(demoFullUrl);

      try {
        await AsyncStorage.multiSet([
          ['baseUrl', demoFullUrl],
          ['selectedUrl', demoFullUrl],
          ['contextPathUrl', contextPath],
          ['selectedEnvironmentUrl', formattedEnvUrl]
        ]);

        dispatch(setIsDemo(true));
        dispatch(setSelectedUrl(demoFullUrl));
        dispatch(setSelectedEnvironmentUrl(formattedEnvUrl));
        dispatch(setContextPathUrl(contextPath));
      } catch (error) {
        console.error("Error storing demo configuration:", error);
      }

      await login(AdminUsername, AdminPassword);
      await getImageProfile(data);

      try {
        await AsyncStorage.setItem('isDemoTry', References.YES);
        const storedEnviromentsUrl = await AsyncStorage.getItem('storedEnviromentsUrl');
        const storedEnviromentsUrlParsed: string[] = storedEnviromentsUrl?.length
          ? JSON.parse(storedEnviromentsUrl)
          : [];

        dispatch(
          setStoredEnviromentsUrl([
            ...storedEnviromentsUrlParsed,
            demoFullUrl
          ])
        );

        await AsyncStorage.setItem(
          'storedEnviromentsUrl',
          JSON.stringify([...storedEnviromentsUrlParsed, demoFullUrl])
        );

      } catch (error) {
        console.error("Error storing environments:", error);
      }
    } catch (error) {
      show(locale.t('LoginScreen:NetworkError'), 'error');
      console.error("Demo process error:", error);
    } finally {
      dispatch(setLoadingScreen(false));
    }
  };

  const welcomeText = (): string => {
    return deviceIsATablet
      ? locale.t('Welcome')
      : locale.t('WelcomeToEtendoLogin');
  };

  const getWelcomeContainer = () => {
    return windowDimensions.height > 605
      ? styleSheet.welcomeTitleContainer
      : styleSheet.welcomeTitleSmallContainer;
  };

  const getBackgroundImg = () => {
    return deviceIsATablet ? backgroundTabletImg : backgroundMobileImg;
  };

  useEffect(() => {
    const checkStoredData = async () => {
      try {
        const storedUrl = await AsyncStorage.getItem('selectedUrl');
        if (!storedUrl) {
          console.warn("The selected URL was not found, using the demo URL.");
          dispatch(setSelectedUrl(References.DemoUrl));
        } else {
          dispatch(setSelectedUrl(storedUrl));
        }
      } catch (error) {
        console.error("Error to access AsyncStorage:", error);
        dispatch(setSelectedUrl(References.DemoUrl));
      }
    };

    checkStoredData();
  }, []);

  const ChangedPassword = () => {
    return (
      <Dialog
        visible={showChangePassword}
        style={{
          height: '25%',
          width: deviceIsATablet ? '50%' : '90%',
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
        }}
      >
        <Dialog.Content>
          <Text allowFontScaling={false}>{locale.t('Recover_password')}</Text>
        </Dialog.Content>
        <View style={{ width: '100%', alignSelf: 'center' }}>
          <TouchableOpacity
            onPress={() => setShowChangePassword(false)}
            style={{
              backgroundColor: defaultTheme.colors.accent,
              width: '20%',
              alignSelf: 'flex-end',
              marginRight: 20,
            }}
          >
            <Button style={{ width: '100%', alignItems: 'center' }}>Ok</Button>
          </TouchableOpacity>
        </View>
      </Dialog>
    );
  };

  return (
    <KeyboardAwareScrollView
      style={styles.containerFlex}
      ref={(ref: KeyboardAwareScrollView) => {
        listViewRef = ref;
      }}
      keyboardShouldPersistTaps="handled"
    >
      <Image source={getBackgroundImg()} style={styles.backgroundContainer} />
      <View
        style={[
          styles.generalContainer,
          { height: Dimensions.get('window').height },
        ]}
      >
        <View style={styles.container}>
          <View style={styles.buttonsDemoSettings}>
            <View style={styles.buttonDemo}>
              <ButtonUI
                typeStyle="terciary"
                onPress={() => demo()}
                text={locale.t('DemoTry')}
              />
            </View>
            <View style={styles.settingsImageContainer}>
              <ButtonUI
                onPress={() => props.navigation.navigate('Settings')}
                text={locale.t('Settings')}
                typeStyle="whiteBorder"
                iconLeft={<SettingIcon style={{ height: 20, width: 20 }} />}
              />
            </View>
          </View>
          <View style={styles.etendoLogoContainer}>
            {!deviceIsATabletSmall && (
              <Image
                source={require('../../../assets/etendo-logotype.png')}
                style={styles.etendoLogotype}
              />
            )}
            <View style={getWelcomeContainer()}>
              <Text style={styles.welcomeTitle}>{welcomeText()}</Text>
              <Image
                source={require('../../img/stars.png')}
                style={styles.starsImage}
              />
            </View>
            <Text style={styles.credentialsText}>
              {locale.t('EnterCredentials')}
            </Text>
          </View>

          <View style={styles.containerInputs}>
            <View style={styles.textInputStyle}>
              <Text style={styles.textInputsHolders}>{locale.t('User')}</Text>
              <TextInput
                value={username}
                onChangeText={username => {
                  setUsername(username);
                  if (error) dispatch(setError(false));
                }}
                placeholder={locale.t('User')}
                isError={error}
              />
            </View>
            <View style={styles.textInputStyle}>
              <Text style={styles.textInputsHolders}>
                {locale.t('Password')}
              </Text>
              <PasswordInput
                value={password}
                onChangeText={password => {
                  setPassword(password);
                  if (error) dispatch(setError(false));
                }}
                placeholder={locale.t('Password')}
                isError={error}
              />
            </View>
          </View>
          <View style={styles.loginButton}>
            <ButtonUI
              onPress={submitLogin}
              text={locale.t('Log in')}
              typeStyle={'primary'}
              width="100%"
              height={50}
            />
          </View>
          <TouchableOpacity
            activeOpacity={0.5}
            style={styles.changePasswordStyle}
            onPress={() => [setShowChangePassword(true)]}
          ></TouchableOpacity>
          <Text style={styles.copyRightStyle}>
            © Copyright Etendo 2020-2025
          </Text>
        </View>
        {ChangedPassword()}
      </View>
    </KeyboardAwareScrollView>
  );
};

const Login = props => {
  return <LoginFunctional {...props} />;
};
export default Login;
