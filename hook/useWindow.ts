import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../redux";
import {
  selectDevUrl,
  selectSelectedUrl,
  selectToken,
  setDevUrl
} from "../redux/user";
import {
  selectWindows,
  setAppData,
  setIsDeveloperMode,
  setLoading,
  setLoadingScreen,
  setLogged,
  setMenuItems,
  setWindows
} from "../redux/window";
import { getUrl } from "../src/ob-api/ob";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { References } from "../src/constants/References";
const method = "GET";

export const useWindow = () => {
  const dispatch = useAppDispatch();
  const windows = useAppSelector(selectWindows);
  const selectedUrl = useAppSelector(selectSelectedUrl);
  const devUrl = useAppSelector(selectDevUrl);
  const token = useAppSelector(selectToken);

  const loadWindows = async (token) => {
    try {
      await loadDynamic(token);
      dispatch(setLoadingScreen(false));
    } catch (error) {
      throw new Error(error);
    }
  };

  useEffect(() => {
    dispatch(setDevUrl(devUrl));
  }, [devUrl]);

  const unloadWindows = () => {
    dispatch(setWindows([]));
    dispatch(setMenuItems([]));
  };

  const getWindow = (id: string) => {
    return windows?.find((w) => {
      return w.id === id;
    });
  };

  const getMenuItems = (windows: any) => {
    return windows?.map((win) => {
      return {
        key: win.id,
        label: win._identifier,
        windowId: win.id,
        windowName: win.name,
        isSalesTransaction: win.salesTransaction
      };
    });
  };

  const loadDynamic = async (token) => {
    dispatch(setLoading(true));
    let storedEnviromentsUrl = await getUrl();
    const callUrlApps = `${storedEnviromentsUrl}/sws/com.etendoerp.dynamic.app.userApp`;
    await fetch(callUrlApps, {
      method: method,
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`
      },
      mode: "no-cors"
    })
      .then(async (callApps) => {
        const data = await callApps.json();
        await listWindows(data.data);
        dispatch(setLogged(true));
      })
      .catch((err) => {
        dispatch(setAppData([]));
        dispatch(setLogged(true));
        console.log(err);
      })
      .finally(() => {
        dispatch(setLoading(false));
        dispatch(setLoadingScreen(false));
      });
  };

  const listWindows = async (appsData: any[]) => {
    try {
      const mi = appsData
        ? appsData.map((app: any) => {
            const path = app.path.split("/");
            const __id = app.etdappAppVersionIsDev
              ? path[path.length - 1]
              : app.path;
            return {
              name: app.etdappAppName,
              __id: __id,
              url: app.etdappAppVersionIsDev ? devUrl : selectedUrl,
              isDev: app.etdappAppVersionIsDev
            };
          })
        : [];
      let [{ isDev = false }] = mi;
      dispatch(setIsDeveloperMode(isDev));
      dispatch(setAppData([...appsData]));
      dispatch(setMenuItems([...mi]));
      await fetchDevURL(selectedUrl, isDev);
      await AsyncStorage.setItem("isDeveloperMode", JSON.stringify(isDev));
      await AsyncStorage.setItem("appData", JSON.stringify([...appsData]));
      await AsyncStorage.setItem("menuItems", JSON.stringify([...mi]));
    } catch (error) {
      dispatch(setAppData([]));
      dispatch(setMenuItems([]));
    }
  };

  const fetchDevURL = async (URLProd: string, isDev?: boolean) => {
    try {
      const isDeveloperMode = !!isDev
        ? !!isDev
        : await AsyncStorage.getItem("isDeveloperMode");
      if (isDeveloperMode) {
        const hasToken = token || (await AsyncStorage.getItem("token"));
        if (hasToken) {
          const devUrlLS = await AsyncStorage.getItem("debugURL");
          dispatch(setDevUrl(devUrlLS));
        } else {
          await AsyncStorage.setItem("debugURL", References.LocalURLDev);
          dispatch(setDevUrl(References.LocalURLDev));
        }
      } else {
        await AsyncStorage.setItem("debugURL", URLProd);
        dispatch(setDevUrl(URLProd));
      }
    } catch (_error) {
      AsyncStorage.setItem("debugURL", "");
      dispatch(setDevUrl(""));
    }
  };

  return {
    loadWindows,
    unloadWindows,
    fetchDevURL,
    getWindow,
    getMenuItems,
    loadDynamic
  };
};
