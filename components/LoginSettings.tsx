import React, {useContext, useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  Keyboard,
  PixelRatio,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
  TouchableOpacity,
} from 'react-native';
import {ContainerContext} from '../contexts/ContainerContext';
import {
  BLACK,
  BLUE,
  GREY_40,
  GREY_BLUE,
  GREY_BLUE_50,
  WHITE,
} from '../styles/colors';
import Orientation from 'react-native-orientation-locker';
import {INTER_SEMIBOLD} from '../styles/fonts';
import {useNavigation} from '@react-navigation/native';

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;

export const LoginSettings = ({}) => {
  const navigation = useNavigation<any>();

  const {
    state: {url},
    dispatch,
  } = useContext(ContainerContext);
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin');

  const isTablet = () => {
    let pixelDensity = PixelRatio.get();
    const adjustedWidth = width * pixelDensity;
    const adjustedHeight = height * pixelDensity;
    if (pixelDensity < 2 && (adjustedWidth >= 1000 || adjustedHeight >= 1000)) {
      return true;
    } else
      return (
        pixelDensity === 2 && (adjustedWidth >= 1920 || adjustedHeight >= 1920)
      );
  };

  useEffect(() => {
    if (isTablet()) {
      Orientation.lockToLandscape();
    } else {
      Orientation.lockToPortrait();
    }
  }, []);

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

  const placeholderCurrentURL = 'https://etendo.demo.cloud/etendo/';
  const [URL, setURL] = React.useState<string>('');

  const [currentLanguage, setCurrentLanguage] = useState('English');

  const [willBeRemembered, setWillBeRemembered] = useState(false);
  const [isFocusedPassword, setIsFocusedPassword] = useState(false);

  const [isFocusedURL, setIsFocusedURL] = React.useState(false);
  const [isFocusedChangeLanguage, setIsFocusedChangeLanguage] = useState(false);

  const [state, setState] = useState(false);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView
        style={isTablet() ? styles.containerTablet : styles.containerMobile}>
        {isTablet() && (
          <Image
            source={require('../assets/background-login.png')}
            style={{
              resizeMode: 'contain',
              width: '34.5%',
              height: '100%',
            }}
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
              marginVertical: isTablet() ? 25 : 0,
              marginHorizontal: isTablet() ? 80 : 0,
            }}>
            <View
              style={{
                position: 'absolute',
                right: 0,
                height: 40,
                width: 40,
                borderRadius: 50,
                justifyContent: 'center',
              }}>
              <Pressable
                style={{zIndex: 1}}
                onPress={() => navigation.navigate('MainScreen')}>
                <Image
                  source={require('../assets/user.png')}
                  style={{
                    resizeMode: 'contain',
                    height: 30,
                    width: 30,
                    tintColor: BLUE,
                    alignSelf: 'center',
                  }}
                />
              </Pressable>
            </View>
            <Text
              style={{
                fontFamily: INTER_SEMIBOLD,
                color: BLUE,
                fontSize: isTablet() ? 28 : 24,
              }}>
              Settings
            </Text>

            <View
              style={{
                marginHorizontal: isTablet() ? 75 : 0,
                marginVertical: 35,
              }}>
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
                  placeholder={placeholderCurrentURL}
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
                  style={{
                    resizeMode: 'contain',
                    height: 45,
                    width: 150,
                  }}
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
                    style={
                      !isFocusedChangeLanguage
                        ? {
                            resizeMode: 'contain',
                            height: 12,
                            width: 12,
                            alignSelf: 'flex-end',
                          }
                        : {
                            resizeMode: 'contain',
                            height: 12,
                            width: 12,
                            alignSelf: 'flex-end',
                            transform: [{rotate: '180deg'}],
                          }
                    }
                  />
                </View>
              </Pressable>
              {isFocusedChangeLanguage && (
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: BLUE,
                    borderTopWidth: 0,
                    borderBottomLeftRadius: 5,
                    borderBottomRightRadius: 5,
                    marginTop: -8,
                    backgroundColor: WHITE,
                  }}>
                  <Text
                    style={{
                      borderBottomWidth: 1,
                      borderTopWidth: 1,
                      padding: 10,
                      borderColor: GREY_BLUE_50,
                    }}
                    onPress={() => {
                      setCurrentLanguage('English');
                      setIsFocusedChangeLanguage(!isFocusedChangeLanguage);
                    }}>
                    English
                  </Text>
                  <Text
                    style={{
                      padding: 10,
                      borderColor: GREY_BLUE_50,
                    }}
                    onPress={() => {
                      setCurrentLanguage('Spanish');
                      setIsFocusedChangeLanguage(!isFocusedChangeLanguage);
                    }}>
                    Spanish
                  </Text>
                </View>
              )}
            </View>

            {/* 
            <View
              style={{
                justifyContent: 'space-between',
                flexDirection: 'row',
              }}>
              <View style={{width: '60%'}}>
                <Text style={styles.secondOptionTitle}>Etendo Mobile Demo</Text>
                <Text
                  style={
                    isTablet()
                      ? [styles.secondOptionDescription, {fontSize: 16}]
                      : [styles.secondOptionDescription, {fontSize: 14}]
                  }>
                  You can connect to the Demo server to try the app
                </Text>
              </View>

              <View style={styles.buttonDemoTryContainer}>
                <Pressable
                  style={styles.buttonDemoTryContent}
                  onPress={() => onLogin()}>
                  <Text style={styles.buttonDemoTryText}>Demo try</Text>
                </Pressable>
              </View>
            </View> */}

            {/* <View style={{marginBottom: 15}}>
        <Text
          style={{
            color: 'rgba(0,0,0,0.5)',
            fontFamily: 'Inter',
            marginBottom: 2,
            fontSize: 12,
          }}>
          URL
        </Text>
        <TextInput
          style={{
            height: 47.5,
            borderWidth: 1,
            borderColor: BLUE,
            borderRadius: 10,
            color: BLUE,
            padding: 10,
          }}
          value={url}
          onChangeText={text => {
            dispatch({url: text});
          }}
        />
      </View> */}

            {/* <View>
        <Text style={{color: BLACK}}>URL</Text>
        <TextInput
          value={url}
          onChangeText={text => {
            dispatch({url: text});
          }}
          style={{borderWidth: 1, color: BLACK}}
        />
      </View> */}

            {/* <View>
        <Text style={{color: BLACK}}>URL</Text>
        <TextInput
          value={url}
          onChangeText={text => {
            dispatch({url: text});
          }}
          style={{borderWidth: 1, color: BLACK}}
        />
      </View>
      <View>
        <Text style={{color: BLACK}}>Username</Text>
        <TextInput
          value={username}
          onChangeText={setUsername}
          style={{borderWidth: 1, color: BLACK}}
        />
      </View>
      <View>
        <Text style={{color: BLACK}}>Password</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
          style={{borderWidth: 1, color: BLACK}}
        />
      </View> */}
            {/* <View style={styles.container}>
        <Button title="Login" onPress={() => onLogin()} />
      </View> */}
          </View>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  containerMobile: {
    backgroundColor: '#ffffff',
    flex: 1,
    paddingHorizontal: 30,
    paddingVertical: 50,
  },
  containerTablet: {
    backgroundColor: '#ffffff',
    flex: 1,
    flexDirection: 'row',
  },
  contentContainerMobile: {
    flex: 1,
  },
  contentContainerTablet: {
    flex: 1,
    backgroundColor: '#ffffff',
    // paddingVertical: 30,
    // paddingHorizontal: 90,
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
    color: '#313236',
    marginTop: 10,
    marginBottom: 20,
    fontFamily: 'Inter',
    fontSize: 14,
  },
  credentialsTextTablet: {
    color: '#313236',
    marginVertical: 7.5,
    fontSize: 19.5,
    textAlign: 'center',
    fontWeight: '500',
  },
  inputContainer: {
    marginBottom: 20,
  },
  credentialLabel: {
    color: 'rgba(0,0,0,0.5)',
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
