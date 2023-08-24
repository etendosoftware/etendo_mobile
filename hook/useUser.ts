import { OBRest, Restrictions } from "etrest";
import { useAppDispatch, useAppSelector } from "../redux";
import {
  selectSelectedLanguage,
  selectStoredEnviromentsUrl,
  selectToken,
  selectUser,
  setBindaryImg,
  setData,
  setLanguage,
  setSelectedUrl,
  setStoredEnviromentsUrl,
  setStoredLanguages,
  setToken,
  setUser
} from "../redux/user";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IData, ILanguage } from "../src/interfaces";
import { useWindow } from "./useWindow";
import { getUrl, setUrl } from "../src/ob-api/ob";
import { selectIsDemo, setIsDemo } from "../redux/window";

export const useUser = () => {
  const dispatch = useAppDispatch();
  const { loadWindows } = useWindow();
  const selectedLanguage = useAppSelector(selectSelectedLanguage);
  const storedEnviromentsUrl = useAppSelector(selectStoredEnviromentsUrl);
  const token = useAppSelector(selectToken);
  const user = useAppSelector(selectUser);
  const isDemo = useAppSelector(selectIsDemo);

  // Important: this method is called in App.tsx,
  // all that is setted here is available in the whole app (redux)
  const atAppInit = async (languages: ILanguage[]) => {
    const currentLanguage = await AsyncStorage.getItem("selectedLanguage");
    const storedEnviromentsUrl = await AsyncStorage.getItem(
      "storedEnviromentsUrl"
    );
    const currentEnviromentsUrl = await loadEnviromentsUrl();
    dispatch(setLanguage(currentLanguage));
    dispatch(setStoredLanguages(languages));
    storedEnviromentsUrl &&
      dispatch(
        setStoredEnviromentsUrl([
          ...currentEnviromentsUrl,
          ...JSON.parse(storedEnviromentsUrl)
        ])
      );
  };

  const login = async (user, pass) => {
    try {
      await OBRest.loginWithUserAndPassword(user, pass);
    } catch (ignored) {}
    const token = OBRest.getInstance()
      .getAxios()
      .defaults.headers.Authorization.replace("Bearer ", "");
    await reloadUserData(null, user);
    dispatch(setToken(token));
    dispatch(setUser(user));
    await AsyncStorage.setItem("token", token);
    await AsyncStorage.setItem("user", user);
    await loadWindows(token);
  };

  const reloadUserData = async (storedToken?: string, username?: string) => {
    if (storedToken) {
      dispatch(setToken(storedToken));
      OBRest.loginWithToken(storedToken);
    }

    let context = OBRest.getInstance().getOBContext();

    dispatch(
      setData({
        username: username ? username : user,
        userId: context?.getUserId(),
        defaultRoleId: context?.getRoleId(),
        defaultWarehouseId: context?.getWarehouseId(),
        roleId: context?.getRoleId(),
        warehouseId: context?.getWarehouseId(),
        organization: context?.getOrganizationId(),
        client: context?.getClientId()
      })
    );
  };

  // Savings
  const saveEnviromentsUrl = async (storedEnviromentsUrl) => {
    if (storedEnviromentsUrl && storedEnviromentsUrl.length) {
      dispatch(setStoredEnviromentsUrl(storedEnviromentsUrl));
      await AsyncStorage.setItem(
        "storedEnviromentsUrl",
        JSON.stringify(storedEnviromentsUrl)
      );
    }
  };

  const saveToken = async (tokenP?, userP?) => {
    await AsyncStorage.setItem("token", tokenP ? tokenP : token);
    await AsyncStorage.setItem("user", userP ? userP : user);
  };

  // Loaders
  const loadEnviromentsUrl = () => {
    return storedEnviromentsUrl;
  };

  const loadLanguage = () => {
    return selectedLanguage;
  };

  const setCurrentLanguage = (value: string) => {
    dispatch(setLanguage(value));
  };

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    await AsyncStorage.removeItem("data");
    await AsyncStorage.removeItem("baseUrl");

    if (isDemo) {
      dispatch(setSelectedUrl(null));
      dispatch(setIsDemo(false));
    }
    dispatch(setToken(null));
    dispatch(setUser(null));
    dispatch(setData(null));
  };

  const getImageProfile = async (data: IData) => {
    try {
      const imageIdCriteria = OBRest.getInstance().createCriteria("ADUser");
      imageIdCriteria.add(Restrictions.equals("id", data.userId));
      const user: any = await imageIdCriteria.uniqueResult();
      const imageCriteria = OBRest.getInstance().createCriteria("ADImage");
      imageCriteria.add(Restrictions.equals("id", user.image));
      const imageList: any[] = await imageCriteria.list();
      if (imageList.length && imageList[0]?.bindaryData) {
        dispatch(setBindaryImg(imageList[0].bindaryData));
      }
    } catch (error) {}
  };

  return {
    login,
    reloadUserData,
    saveEnviromentsUrl,
    saveToken,
    loadEnviromentsUrl,
    loadLanguage,
    setCurrentLanguage,
    atAppInit,
    logout,
    getImageProfile
  };
};
