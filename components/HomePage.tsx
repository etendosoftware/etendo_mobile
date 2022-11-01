import React from 'react'
import { StyleSheet, View, ScrollView, Button } from 'react-native'
import DynamicComponent from './DynamicComponent';

const HomePage = ({ route }: any) => {

    const RenderDynamicComponents = (props: any) => {
        const appId = route.params.__id;
        const url = route.params.url;
        return (
            <>
                <View style={{ paddingVertical: 15 }}>
                    <DynamicComponent __id={appId} url={url} children={undefined} />
                </View>
            </>
        )
    };

    return (
        <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={styles.backgroundStyle}>
            <View>
                <RenderDynamicComponents />
            </View>
        </ScrollView >
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
