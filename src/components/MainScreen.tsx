import React from "react";
import { StyleSheet, View } from "react-native";
import {
  NavigationContainer,
  useNavigationContainerRef
} from "@react-navigation/native";
import DynamicComponent from "./DynamicComponent";
import { Etendo } from "../helpers/Etendo";

const HomePage = ({ route }: any) => {
  const RenderDynamicComponents = (props: any) => {
    const appId = route.params.__id;
    const url = route.params.url;
    const childNavigation = useNavigationContainerRef();
    Etendo.navigation[route.params.name] = childNavigation;

    return (
      <>
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            <DynamicComponent __id={appId} url={url} children={undefined} />
          </View>
        </View>
      </>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <RenderDynamicComponents />
    </View>
  );
};

export default HomePage;

const styles = StyleSheet.create({
  button: {
    backgroundColor: "blue",
    borderColor: "blue",
    borderWidth: 1,
    padding: 10,
    marginBottom: 10
  },
  buttonText: {
    color: "white"
  },
  backgroundStyle: {}
});
