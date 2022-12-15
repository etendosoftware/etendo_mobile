/* Imports */
import React, {useContext, useEffect, useState} from 'react';
import {
  Image,
  Keyboard,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import {useNavigation} from '@react-navigation/native';
import Orientation from 'react-native-orientation-locker';
import {ContainerContext} from '../contexts/ContainerContext';

import {INTER_SEMIBOLD} from '../styles/fonts';
import {
  BLACK,
  BLUE,
  GREY_5,
  GREY_BLUE,
  GREY_BLUE_50,
  GREY_PURPLE,
  LIGHT_BLACK,
  PURPLE_40,
  WHITE,
} from '../styles/colors';

import {isTablet} from '../helpers/IsTablet';
// import Button from '../node_modules/etendo-ui-library/components/button/Button';
import Input from '../node_modules/etendo-ui-library/components/input/Input';
import Button from '../node_modules/etendo-ui-library/components/button/Button';

/* Export */
export const Login = ({}) => {
  // using React Native Navigation
  const navigation = useNavigation<any>();

  // use of context
  const {
    state: {url},
    dispatch,
  } = useContext(ContainerContext);

  // use of states
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin');

  // functions
  const onLogin = async () => {
    const callUrl = `${url}/sws/login`;
    const call = await fetch(callUrl, {
      method: 'POST',
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });
    const {token} = await call.json();
    const callUrlApps = `${url}/sws/com.etendoerp.dynamic.app.userApp`;
    const callApps = await fetch(callUrlApps, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await callApps.json();
    dispatch({appsData: data.data, logged: true});
  };

  // side effect not allowing to rotate the screen
  useEffect(() => {
    if (isTablet()) {
      Orientation.lockToLandscape();
    } else {
      Orientation.lockToPortrait();
    }
  }, []);

  const IS_NATIVE = true;

  // return login screen
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView
        style={isTablet() ? styles.containerTablet : styles.containerMobile}>
        {isTablet() && (
          <Image
            source={require('../assets/background-login.png')}
            style={styles.backgroundLoginImage}
          />
        )}
        <View
          style={
            isTablet()
              ? styles.contentContainerTablet
              : styles.contentContainerMobile
          }>
          <View
            style={{
              margin: isTablet() ? 80 : 0,
            }}>
            <Pressable onPress={() => navigation.navigate('LoginSettings')}>
              <View
                style={[
                  styles.settingsImageContainer,
                  {right: isTablet() ? 0 : undefined},
                ]}>
                <Image
                  source={require('../assets/settings.png')}
                  style={styles.settingsImage}
                />
              </View>
            </Pressable>
            <Image
              source={
                isTablet()
                  ? require('../assets/etendo-logotype-standard.png')
                  : require('../assets/etendo-logotype.png')
              }
              style={
                isTablet()
                  ? styles.etendoLogotypeTablet
                  : styles.etendoLogotypeMobile
              }
            />
            <View
              style={[
                styles.welcomeTitleContainer,
                {marginTop: isTablet() ? -15 : 10},
              ]}>
              <Text
                style={[styles.welcomeTitle, {fontSize: isTablet() ? 40 : 30}]}>
                Welcome!
              </Text>
              <Image
                source={require('../assets/stars.png')}
                style={styles.starsImage}
              />
            </View>
            <Text
              style={
                isTablet()
                  ? styles.credentialsTextTablet
                  : styles.credentialsTextMobile
              }>
              Enter your credentials to access your account.
            </Text>

            <View style={{marginHorizontal: isTablet() ? 75 : 0}}>
              <View style={styles.inputContainer}>
                <Text
                  style={
                    isTablet()
                      ? [styles.credentialLabel, {fontSize: 14}]
                      : [styles.credentialLabel, {fontSize: 12}]
                  }>
                  Username
                </Text>

                <View style={{width: '100%', height: 50}}>
                  <Input
                    numberOfLines={2}
                    typeField={'textInput'}
                    value={username}
                    onChangeText={(text: string) => setUsername(text)}
                  />
                </View>
              </View>
              <View style={styles.inputContainer}>
                <Text
                  style={
                    isTablet()
                      ? [styles.credentialLabel, {fontSize: 14}]
                      : [styles.credentialLabel, {fontSize: 12}]
                  }>
                  Password
                </Text>
                <View style={{width: '100%', height: 50}}>
                  <Input
                    numberOfLines={2}
                    typeField={'textInput'}
                    value={password}
                    onChangeText={setPassword}
                  />
                </View>
              </View>

              <View style={{alignSelf: 'center'}}>
                <Button
                  onPress={() => onLogin()}
                  text={'Login'}
                  typeStyle={'primary'}
                  typeSize={'medium'}
                />
              </View>

              <View
                style={[
                  styles.secondOptionContainer,
                  {marginVertical: isTablet() ? 30 : 35},
                ]}>
                <View style={styles.grayLine} />
                <View>
                  <Text
                    style={
                      isTablet()
                        ? [styles.secondOptionText, {fontSize: 15}]
                        : [styles.secondOptionText, {fontSize: 13}]
                    }>
                    Or Login with
                  </Text>
                </View>
                <View style={styles.grayLine} />
              </View>

              <Text
                style={{
                  fontSize: isTablet() ? 16 : 14,
                  color: BLACK,
                  marginBottom: 10,
                }}>
                Demo server to try app
              </Text>

              <View style={{alignSelf: 'center'}}>
                <Button
                  onPress={() => {
                    dispatch({
                      appsData: [],
                      menuItems: [],
                      url: 'https://demo.etendo.cloud/etendo/',
                      logged: false,
                    });
                    onLogin();
                  }}
                  text={'Etendo Mobile Demo'}
                  typeStyle={'terciary'}
                  typeSize={'medium'}
                />
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

/* Styles */
const styles = StyleSheet.create({
  containerMobile: {
    backgroundColor: WHITE,
    flex: 1,
    paddingHorizontal: 30,
    paddingVertical: 50,
  },
  containerTablet: {
    backgroundColor: WHITE,
    flex: 1,
    flexDirection: 'row',
  },
  contentContainerMobile: {
    flex: 1,
  },
  contentContainerTablet: {
    flex: 1,
    backgroundColor: WHITE,
  },
  backgroundLoginImage: {
    resizeMode: 'contain',
    width: '34.5%',
    height: '100%',
  },
  etendoLogotypeMobile: {
    resizeMode: 'contain',
    width: 90,
    height: 90,
    margin: 0,
    padding: 0,
    alignSelf: 'center',
  },
  etendoLogotypeTablet: {
    resizeMode: 'contain',
    width: 150,
    height: 40,
    margin: 0,
    padding: 0,
    alignSelf: 'flex-start',
  },
  settingsImageContainer: {
    backgroundColor: PURPLE_40,
    position: 'absolute',
    height: 40,
    width: 40,
    borderRadius: 50,
    justifyContent: 'center',
  },
  settingsImage: {
    resizeMode: 'contain',
    height: 25,
    width: 25,
    tintColor: BLUE,
    alignSelf: 'center',
  },
  welcomeTitleContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: 10,
  },
  welcomeTitle: {color: BLUE, fontFamily: INTER_SEMIBOLD, fontSize: 30},
  starsImage: {
    position: 'absolute',
    resizeMode: 'contain',
    right: 0,
    width: 27,
    height: 27,
    marginRight: -30,
  },
  credentialsTextMobile: {
    color: GREY_PURPLE,
    marginTop: 10,
    marginBottom: 20,
    fontFamily: 'Inter',
    fontSize: 14,
  },
  credentialsTextTablet: {
    color: GREY_PURPLE,
    marginVertical: 7.5,
    fontSize: 19.5,
    textAlign: 'center',
    fontWeight: '500',
  },
  inputContainer: {
    marginBottom: 20,
  },
  credentialLabel: {
    color: LIGHT_BLACK,
    fontFamily: 'Inter',
    marginBottom: 2,
  },
  isFocusedText: {
    height: 47.5,
    borderWidth: 1,
    borderColor: BLUE,
    borderRadius: 10,
    color: BLUE,
    padding: 10,
  },
  isNotFocusedText: {
    height: 47.5,
    borderWidth: 1,
    borderColor: '#ececec',
    borderRadius: 10,
    color: BLUE,
    padding: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    width: 122.5,
    alignItems: 'center',
    marginVertical: 10,
    marginBottom: 50,
  },
  checkboxIconImage: {
    resizeMode: 'contain',
    marginRight: 10,
    width: 22,
    height: 22,
    margin: 0,
    padding: 0,
    alignSelf: 'center',
  },
  buttonContainer: {
    width: '100%',
    backgroundColor: BLUE,
    padding: 12,
    borderRadius: 8,
  },
  rememberText: {
    color: BLUE,
  },
  buttonText: {
    color: WHITE,
    fontFamily: INTER_SEMIBOLD,
    textAlign: 'center',
  },
  secondOptionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  grayLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#d3d6e1',
    borderRadius: 10,
  },
  secondOptionText: {
    width: 100,
    textAlign: 'center',
    color: GREY_BLUE,
    marginTop: -5,
  },
  secondOptionTitle: {
    color: BLUE,
    fontSize: 20,
    marginBottom: 2.5,
  },
  secondOptionDescription: {
    color: BLACK,
  },
  buttonDemoTryContainer: {
    justifyContent: 'center',
  },
  buttonDemoTryContent: {
    width: 100,
    backgroundColor: '#F2F2F2',
    padding: 10,
    borderWidth: 1,
    borderColor: '#D3D6E1',
    borderRadius: 8,
  },
  buttonDemoTryText: {
    fontFamily: INTER_SEMIBOLD,
    textAlign: 'center',
    color: BLUE,
    textTransform: 'uppercase',
  },
});
