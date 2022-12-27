import React, { useContext, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { NavigationContainer, useNavigationContainerRef } from "@react-navigation/native";
import DynamicComponent from './DynamicComponent';
import { Etendo } from '../helpers/Etendo';
import { ContainerContext } from '../contexts/ContainerContext';

const HomePage = ({ route }: any) => {

    const RenderDynamicComponents = (props: any) => {
        const context = useContext(ContainerContext)
        const appId = route.params.__id;
        const url = route.params.url;
        const childNavigation = useNavigationContainerRef();

        Etendo.navigation[route.params.name] = childNavigation;

        useEffect(() => {
            return () => {
                // Umount
            }
        })
        return (
          <>
            <View style={{flex: 1}}>
              <NavigationContainer
                independent={true}
                onReady={() => {
                  // On ready
                }}
                ref={childNavigation}>
                <View
                  style={{flex: 1}}
                  >
                    <DynamicComponent __id={appId} url={url} children={undefined} />
                </View>
              </NavigationContainer>
            </View>
          </>
        );
    };

    return (
        <View style={{flex: 1}}>
            <RenderDynamicComponents />
        </View>
    )
}

export default HomePage

const styles = StyleSheet.create({
    button: {
        backgroundColor: 'blue', borderColor: 'blue', borderWidth: 1, padding: 10, marginBottom: 10
    },
    buttonText: {
        color: 'white'
    },
    backgroundStyle: {}
});
