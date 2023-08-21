import { useAppDispatch, useAppSelector } from "../redux";
import { selectToken } from "../redux/user";
import {
  selectWindows,
  setAppData,
  setLoading,
  setLoadingScreen,
  setLogged,
  setMenuItems,
  setWindows
} from "../redux/window";
import { getUrl } from "../src/ob-api/ob";
const method = "GET";

export const useWindow = () => {
  const dispatch = useAppDispatch();
  const windows = useAppSelector(selectWindows);
  const token = useAppSelector(selectToken);

  const loadWindows = async () => {
    try {
      await loadDynamic();
      dispatch(setLoadingScreen(false));
    } catch (error) {
      throw new Error(error);
    }
  };

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

  const loadDynamic = async () => {
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
        dispatch(setAppData(data.data));
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

  return { loadWindows, unloadWindows, getWindow, getMenuItems, loadDynamic };
};
