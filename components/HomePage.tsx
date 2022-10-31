import { CommonActions } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react'
import { StyleSheet, View, ScrollView, Button } from 'react-native'
import { ContainerContext } from '../contexts/ContainerContext';
import { DEV_URL } from './Container';
import DynamicComponent from './DynamicComponent';

const HomePage = ({ route }: any) => {

    const [refresh, setRefresh] = useState(1);

    const RenderDynamicComponents = (props: any) => {
        const appId = route.params.__id;
        const url = route.params.url;
        return (
            <>
                <View style={{ paddingVertical: 15 }}>
                    <DynamicComponent refresh={refresh} __id={appId} url={url} children={undefined} />
                </View>
            </>
        )
    };

    return (
        <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={styles.backgroundStyle}>
            <View>
                <RenderDynamicComponents refresh={refresh} />
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
