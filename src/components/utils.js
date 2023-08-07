import React from "react";
import packages from "./packages";
import Toast from "react-native-toast-message";
import locale from "../i18n/locale";
import AsyncStorage from "@react-native-async-storage/async-storage";

function getParsedModule(code, moduleName, packages) {
  try {
    const _this = Object.create(packages);
    function require(name) {
      try {
        if (!(name in _this) && moduleName === name) {
          let module = { exports: {} };
          _this[name] = () => module;
          let wrapper = Function("require, exports, module", code);
          wrapper(require, module.exports, module);
        } else if (!(name in _this)) {
          console.error(`Module '${name}' not found`);
          throw `Module '${name}' not found`;
        }
        return _this[name]().exports;
      } catch (error) {
        console.error(error);
        throw error;
      }
    }
    return require(moduleName);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function fetchComponent(id, url, navigation) {
  try {
    const urlToFetch = `${url}/${id}?timestamp=${+new Date()}`;
    const responseChange = await fetch(urlToFetch, { method: "HEAD" });
    const lastModifiedNew = responseChange.headers.get("last-modified");
    const dateLastDownBundle = await AsyncStorage.getItem("dateLastDownBundle");
    let component;
    if (!dateLastDownBundle || dateLastDownBundle < lastModifiedNew) {
      const response = await fetch(urlToFetch);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.text();
      await AsyncStorage.setItem("data", data);
      const date = responseChange.headers.get("date");
      await AsyncStorage.setItem("dateLastDownBundle", date);
      try {
        component = { default: getParsedModule(data, id, packages) };
      } catch (e) {
        console.error(e);
        throw e;
      }
    }
    if (!component || dateLastDownBundle) {
      const existingCode = await AsyncStorage.getItem("data");
      component = {
        default: getParsedModule(existingCode, id, packages)
      };
    }
    return component.default;
  } catch (error) {
    return {
      default() {
        navigation.navigate("Home");
        Toast.show({
          type: "error",
          position: "bottom",
          text1: locale.t("UrlFetchFailed", { url: url }),
          visibilityTime: 5000,
          autoHide: true,
          topOffset: 30,
          bottomOffset: 40
        });
        return <React.Fragment />;
      }
    };
  }
}
