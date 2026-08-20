import React from "react";
import { View, StatusBar } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import {
  StackNavigationProp,
  createStackNavigator
} from "@react-navigation/stack";

import { PRIMARY_100 } from "../../styles/colors";
import styles from "./style";
import Login from "../../screens/Login";
import Settings from "../../screens/Settings";
type RootStackParamList = {
  Login: any;
  Settings: any;
};
const Stack = createStackNavigator<RootStackParamList>();

type LoginStackProps = {
  navigation: StackNavigationProp<RootStackParamList, "Login">;
};
const LoginStack: React.FC<LoginStackProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  return (
    <>
      <View style={[styles.containerBackground, { height: insets.top }]} />
      <SafeAreaView style={styles.container} edges={["bottom", "left", "right"]}>
        <StatusBar barStyle="light-content" backgroundColor={PRIMARY_100} translucent />
        <Stack.Navigator
          initialRouteName={"Login"}
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name={"Settings"} component={Settings} />
        </Stack.Navigator>
      </SafeAreaView>
    </>
  );
};

export default LoginStack;
