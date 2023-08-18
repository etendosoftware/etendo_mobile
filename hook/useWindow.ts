import { useAppDispatch, useAppSelector } from "../redux";
import { selectSelectedLanguage } from "../redux/user";
import { ADWindow } from "../src/ob-api/objects";
import { selectWindows, setMenuItems, setWindows } from "../redux/window";

export const useWindow = () => {
  const dispatch = useAppDispatch();
  const selectedLanguage = useAppSelector(selectSelectedLanguage);
  const windows = useAppSelector(selectWindows);

  const loadWindows = async () => {
    try {
      const response = await ADWindow.getWindows("en_US");
      dispatch(setWindows(response?.windows));
      const items = getMenuItems(response?.windows);
      console.log("🔷items", items);
      console.log("🔷response", response);
      dispatch(setMenuItems(items));
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

  return { loadWindows, unloadWindows, getWindow, getMenuItems };
};
