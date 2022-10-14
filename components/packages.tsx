import * as React from "react";
import * as ReactNative from "react-native";
import * as ReactNavigationNative from "@react-navigation/native";
import * as ReactNavigationNativeStack from "@react-navigation/native-stack";

const Packages = {
    "react": () => React,
    "react-native": () => ReactNative,
    "@react-navigation/native": () => ReactNavigationNative,
    "@react-navigation/native-stack": () => ReactNavigationNativeStack,
}


const fromPairs = (pairs) => Object.assign({}, ...pairs.map(([k, v]) => ({ [k]: v })));
const AllPackages = fromPairs(
    Object.keys(Packages).map(k => [k, () => ({ exports: Packages[k]() })])
);

export default AllPackages