import React from "react";
import { View } from "react-native";
import {
  NavigationContainer,
  useNavigationContainerRef
} from "@react-navigation/native";
import DynamicComponent from "./DynamicComponent";
import { Etendo } from "../helpers/Etendo";
import {
  selectSelectedLanguage,
  selectSelectedUrl,
  selectToken,
  selectUser
} from "../../redux/user";
import { useAppSelector } from "../../redux";

const HomePage = ({ route, navigation }: any) => {
  const token = useAppSelector(selectToken);
  const user = useAppSelector(selectUser);
  const language = useAppSelector(selectSelectedLanguage);
  const selectedUrl = useAppSelector(selectSelectedUrl);
  const RenderDynamicComponents = (props: any) => {
    const appId = route.params.__id;
    const url = selectedUrl;
    const childNavigation = useNavigationContainerRef();
    Etendo.navigation[route.params.name] = childNavigation;

    return (
      <>
        <View style={{ flex: 1 }}>
          <NavigationContainer
            independent={true}
            onReady={() => {}}
            ref={childNavigation}
          >
            <DynamicComponent
              __id={appId}
              url={url}
              children={childNavigation}
              navigationContainer={navigation}
              token={token}
              user={user}
              language={language}
            />
          </NavigationContainer>
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
