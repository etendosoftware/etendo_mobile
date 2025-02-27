import React, {useEffect} from 'react';
import { Text, View } from 'react-native';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import DynamicComponent from './DynamicComponent';
import { Etendo } from '../helpers/Etendo';
import {
  selectContextPathUrl,
  selectData,
  selectSelectedEnvironmentUrl,
  selectSelectedLanguage,
  selectToken,
} from '../../redux/user';
import { RootState,useAppSelector } from '../../redux';
import { selectIsDemo } from '../../redux/window';
import Camera from './Camera';
import {useSelector} from "react-redux";

const HomePage = ({ route, navigation }: any) => {
  const sharedFiles = useAppSelector((state: RootState) => {
     console.info("Change on SharedFiles -> ", state.sharedFiles.files);
    return state.sharedFiles.files
  });
  console.info("Shared files:", sharedFiles);
  const token = useAppSelector(selectToken);
  const data = useAppSelector(selectData);
  const language = useAppSelector(selectSelectedLanguage);
  const selectedEnvironmentUrl = useAppSelector(selectSelectedEnvironmentUrl);
  const isDemoTry = useAppSelector(selectIsDemo);
  const contextPathUrl = useAppSelector(selectContextPathUrl);

  const RenderDynamicComponents = (props: any) => {
    const appId = route.params.__id + "?v=" + Math.random();

    const childNavigation = useNavigationContainerRef();
    Etendo.navigation[route.params.name] = childNavigation;
    return (
      <>
        <View style={{ flex: 1 }} testID='dynamic-component-container'>
          <NavigationContainer
            independent={true}
            onReady={() => { }}
            ref={childNavigation}
          >
            <DynamicComponent
              __id={appId}
              url={selectedEnvironmentUrl}
              sharedFiles={sharedFiles}
              children={childNavigation}
              navigationContainer={navigation}
              token={token}
              user={data.username}
              language={language}
              dataUser={data}
              isDev={!!route.params.isDev}
              isDemoTry={isDemoTry}
              Camera={Camera}
              contextPathUrl={contextPathUrl}
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
