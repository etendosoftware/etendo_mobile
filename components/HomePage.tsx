import React, { useEffect, useState } from 'react'
import { StyleSheet, View, ScrollView } from 'react-native'
import DynamicComponent from './DynamicComponent';

const HomePage = ({ route, __id }: any) => {
    const [appId, setAppId] = useState(__id);
    const [url, setUrl] = useState("");
    console.log(route)
    useEffect(() => {
        if (route?.params?.__id) {
            setAppId(route.params.__id);
            setUrl(route.params.url);
        }
    })
    const renderDynamicComponents = (appId: string, url: string) => (
        <>
            <View style={{ paddingVertical: 15 }}>
                <DynamicComponent __id={appId} url={url} children={undefined} />
            </View>
        </>
    );
    return (
        <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={styles.backgroundStyle}>
            <View>
                {renderDynamicComponents(appId, url)}
            </View>
        </ScrollView>
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
