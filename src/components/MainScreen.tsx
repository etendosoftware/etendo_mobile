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
  selectSelectedEnvironmentUrl,
  selectSelectedLanguage,
  selectToken
} from "../../redux/user";
import { useAppSelector } from "../../redux";

const HomePage = ({ route, navigation }: any) => {
  const token = useAppSelector(selectToken);
  const data = useAppSelector(selectData);
  const language = useAppSelector(selectSelectedLanguage);
  const selectedEnvironmentUrl = useAppSelector(selectSelectedEnvironmentUrl);

  const RenderDynamicComponents = (props: any) => {
    const appId = route.params.__id;

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
              url={selectedEnvironmentUrl}
              children={childNavigation}
              navigationContainer={navigation}
              token={token}
              user={data.username}
              language={language}
              dataUser={data}
              isDev={!!route.params.isDev}
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
