import React from "react";
import { View } from "react-native";
import {
  NavigationContainer,
  useNavigationContainerRef
} from "@react-navigation/native";
import DynamicComponent from "./DynamicComponent";
import { Etendo } from "../helpers/Etendo";
import {
  selectData,
  selectSelectedLanguage,
  selectSelectedUrl,
  selectToken
} from "../../redux/user";
import { useAppSelector } from "../../redux";
import { selectIsDemo } from "../../redux/window";
import { determineSubappUrl } from "../utils";

const HomePage = ({ route, navigation }: any) => {
  const token = useAppSelector(selectToken);
  const data = useAppSelector(selectData);
  const language = useAppSelector(selectSelectedLanguage);
  const isDemoTry = useAppSelector(selectIsDemo);
  const selectedUrl = useAppSelector(selectSelectedUrl);

  const RenderDynamicComponents = (props: any) => {
    const appId = route.params.__id;
    const url = determineSubappUrl(isDemoTry, route.params.isDev, selectedUrl);

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
              user={data.username}
              language={language}
              dataUser={data}
              isDev={Boolean(route.params.isDev)}
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
