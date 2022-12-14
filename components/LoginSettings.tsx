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

import {ContainerContext} from '../contexts/ContainerContext';

import Orientation from 'react-native-orientation-locker';
import {useNavigation} from '@react-navigation/native';

import {INTER_SEMIBOLD} from '../styles/fonts';
import {
  BLACK,
  BLUE,
  GREY_10,
  GREY_5,
  GREY_BLUE,
  GREY_BLUE_50,
  GREY_PURPLE,
  LIGHT_BLACK,
  PURPLE_50,
  WHITE,
} from '../styles/colors';
import {isTablet} from '../helpers/IsTablet';

/* Export */
export const LoginSettings = ({}) => {
  // using React Native Navigation
  const navigation = useNavigation<any>();

  // use of context
  const {
    state: {url},
    dispatch,
  } = useContext(ContainerContext);

  // use of states
  const [URL, setURL] = React.useState<string>(url);
  const [currentLanguage, setCurrentLanguage] = useState('English');
  const [isFocusedURL, setIsFocusedURL] = React.useState(false);
  const [isFocusedChangeLanguage, setIsFocusedChangeLanguage] = useState(false);

  // side effect not allowing to rotate the screen
  useEffect(() => {
    if (isTablet()) {
      Orientation.lockToLandscape();
    } else {
      Orientation.lockToPortrait();
    }
  }, []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView
        style={isTablet() ? styles.containerTablet : styles.containerMobile}>
        {isTablet() && (
          <Image
            source={require('../assets/background-login.png')}
            style={styles.backgroundLogin}
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
            <View style={styles.buttonBackContainer}>
              <Pressable
                style={styles.buttonBackContent}
                onPress={() => {
                  dispatch({
                    appsData: [],
                    menuItems: [],
                    url: URL,
                    logged: false,
                  });
                  navigation.navigate('MainScreen');
                }}>
                <Image
                  source={require('../assets/back.png')}
                  style={styles.backImage}
                />
              </Pressable>
            </View>
            <Text
              style={{
                fontSize: isTablet() ? 28 : 24,
              }}>
              Settings
            </Text>

            <View
              style={[
                styles.inputGeneralContainer,
                {marginHorizontal: isTablet() ? 75 : 0},
              ]}>
              <View style={styles.inputContainer}>
                <Text
                  style={
                    isTablet()
                      ? [styles.credentialLabel, {fontSize: 14}]
                      : [styles.credentialLabel, {fontSize: 12}]
                  }>
                  Server URL
                </Text>
                <TextInput
                  onFocus={() => setIsFocusedURL(true)}
                  onBlur={() => setIsFocusedURL(false)}
                  placeholderTextColor={GREY_BLUE}
                  placeholder={URL}
                  style={
                    isFocusedURL
                      ? isTablet()
                        ? [styles.isFocusedText, {fontSize: 16}]
                        : [styles.isFocusedText, {fontSize: 14}]
                      : isTablet()
                      ? [styles.isNotFocusedText, {fontSize: 16}]
                      : [styles.isNotFocusedText, {fontSize: 14}]
                  }
                  value={URL}
                  onChangeText={setURL}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text
                  style={
                    isTablet()
                      ? [styles.credentialLabel, {fontSize: 14}]
                      : [styles.credentialLabel, {fontSize: 12}]
                  }>
                  Logo
                </Text>
                <Image
                  source={require('../assets/company-logo.png')}
                  style={styles.companyLogo}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text
                  style={
                    isTablet()
                      ? [styles.credentialLabel, {fontSize: 14}]
                      : [styles.credentialLabel, {fontSize: 12}]
                  }>
                  Language
                </Text>
              </View>

              <Pressable
                style={
                  isFocusedChangeLanguage
                    ? styles.isFocusedText
                    : styles.isNotFocusedText
                }
                onPress={() =>
                  setIsFocusedChangeLanguage(!isFocusedChangeLanguage)
                }>
                <View>
                  <Text>{currentLanguage}</Text>
                </View>
                <View>
                  <Image
                    source={require('../assets/dropdown.png')}
                    style={[
                      styles.dropdownImage,
                      isFocusedChangeLanguage
                        ? {transform: [{rotate: '180deg'}]}
                        : null,
                    ]}
                  />
                </View>
              </Pressable>
              {isFocusedChangeLanguage && (
                <View style={styles.containerOption}>
                  <Text
                    style={styles.textOption}
                    onPress={() => {
                      setCurrentLanguage('English');
                      setIsFocusedChangeLanguage(!isFocusedChangeLanguage);
                    }}>
                    English
                  </Text>
                </View>
              )}
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
  backgroundLogin: {
    resizeMode: 'contain',
    width: '34.5%',
    height: '100%',
  },
  buttonBackContainer: {
    position: 'absolute',
    right: 0,
    height: 40,
    width: 40,
    borderRadius: 50,
    justifyContent: 'center',
  },
  buttonBackContent: {
    zIndex: 1,
    width: 40,
    height: 40,
    backgroundColor: PURPLE_50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
  },
  backImage: {
    resizeMode: 'contain',
    height: 20,
    width: 20,
    tintColor: BLUE,
    alignSelf: 'center',
  },
  settingsText: {
    fontFamily: INTER_SEMIBOLD,
    color: BLUE,
  },
  companyLogo: {
    resizeMode: 'contain',
    height: 45,
    width: 150,
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
  inputGeneralContainer: {
    marginVertical: 35,
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
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    height: 47.5,
    borderWidth: 1,
    borderColor: BLUE,
    borderRadius: 10,
    color: BLUE,
    padding: 10,
  },
  isNotFocusedText: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    height: 47.5,
    borderWidth: 1,
    borderColor: GREY_10,
    borderRadius: 10,
    color: BLUE,
    padding: 10,
  },
  containerOption: {
    borderWidth: 1,
    borderColor: BLUE,
    borderTopWidth: 0,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    marginTop: -8,
    backgroundColor: WHITE,
  },
  textOption: {
    borderBottomWidth: 1,
    borderTopWidth: 1,
    padding: 10,
    borderColor: GREY_BLUE_50,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  dropdownImage: {
    resizeMode: 'contain',
    height: 12,
    width: 12,
    alignSelf: 'flex-end',
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
    backgroundColor: GREY_BLUE_50,
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
    backgroundColor: GREY_5,
    padding: 10,
    borderWidth: 1,
    borderColor: GREY_BLUE_50,
    borderRadius: 8,
  },
  buttonDemoTryText: {
    fontFamily: INTER_SEMIBOLD,
    textAlign: 'center',
    color: BLUE,
    textTransform: 'uppercase',
  },
});
