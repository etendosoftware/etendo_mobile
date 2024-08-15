import React from "react";
import { SafeAreaView, StatusBar } from "react-native";
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
  return (
    <>
      <SafeAreaView style={styles.containerBackground} />
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={PRIMARY_100} />
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
