import { OBRest, Restrictions } from "etrest";
import { useAppDispatch, useAppSelector } from "../redux";
import {
  selectSelectedLanguage,
  selectSelectedUrl,
  selectStoredEnviromentsUrl,
  selectToken,
  selectUser,
  setBindaryImg,
  setData,
  setLanguage,
  setSelectedEnvironmentUrl,
  setSelectedUrl,
  setStoredEnviromentsUrl,
  setStoredLanguages,
  setToken,
  setUser
} from "../redux/user";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IData } from "../src/interfaces";
import { useWindow } from "./useWindow";
import {
  selectIsDemo,
  setAppData,
  setIsDemo,
  setIsDeveloperMode,
  setIsSubapp,
  setMenuItems
} from "../redux/window";
import {
  changeLanguage,
  getLanguages,
  getSupportedLanguages,
  languageDefault
} from "../src/helpers/getLanguajes";
import {
  formatLanguageUnderscore,
  languageByDefault
} from "../src/i18n/config";
import { setUrl } from "../src/ob-api/ob";
import { eraseItems } from "../src/utils/KeyStorage";
import { References } from "../src/constants/References";
import DefaultPreference from 'react-native-default-preference';

export const useUser = () => {
  const dispatch = useAppDispatch();
  const { loadWindows } = useWindow();
  const selectedLanguage = useAppSelector(selectSelectedLanguage);
  const storedEnviromentsUrl = useAppSelector(selectStoredEnviromentsUrl);
  const token = useAppSelector(selectToken);
  const user = useAppSelector(selectUser);
  const isDemo = useAppSelector(selectIsDemo);
  const selectedUrl = useAppSelector(selectSelectedUrl);

  // Important: this method is called in App.tsx,
  // all that is setted here is available in the whole app (redux)
  const atAppInit = async () => {
    // Async storage
    const currentToken = await AsyncStorage.getItem("token");
    const currentLanguage = await AsyncStorage.getItem("selectedLanguage");
    const storedEnviromentsUrl = await AsyncStorage.getItem(
      "storedEnviromentsUrl"
    );
    const dataUser = JSON.parse(await AsyncStorage.getItem("dataUser"));
    const selectedUrlStored = await AsyncStorage.getItem("selectedUrl");
    const selectedEnvironmentUrlStored = await AsyncStorage.getItem(
      "selectedEnvironmentUrl"
    );
    const IsDemoTry = await AsyncStorage.getItem("isDemoTry");
    const IsDeveloperMode = await AsyncStorage.getItem("isDeveloperMode");
    const appData = await AsyncStorage.getItem("appData");
    const menuItems = await AsyncStorage.getItem("menuItems");
    // Set redux
    dispatch(setSelectedUrl(selectedUrlStored));
    dispatch(setSelectedEnvironmentUrl(selectedEnvironmentUrlStored));
    dispatch(setToken(currentToken));
    dispatch(setData(dataUser ? dataUser : null));
    dispatch(
      setIsDeveloperMode(IsDeveloperMode ? JSON.parse(IsDeveloperMode) : false)
    );
    dispatch(setMenuItems(JSON.parse(menuItems)));
    dispatch(setAppData(JSON.parse(appData)));
    currentToken && (await reloadUserData(currentToken, dataUser?.username));
    const appLanguages = getSupportedLanguages();
    dispatch(setStoredLanguages(appLanguages));
    storedEnviromentsUrl &&
      dispatch(setStoredEnviromentsUrl([...JSON.parse(storedEnviromentsUrl)]));
    if (IsDemoTry === References.YES) {
      dispatch(setIsDemo(true));
    }
    // Other actions
    await setUrl(selectedUrlStored);
    await changeLanguage(currentLanguage, setCurrentLanguage(currentLanguage));
  };

  const login = async (user, pass) => {
    try {
      await OBRest.loginWithUserAndPassword(user, pass);
    } catch (error) {
      throw new Error(error.message);
    }
    const token = OBRest.getInstance()
      .getAxios()
      .defaults.headers.Authorization.replace("Bearer ", "");
    await reloadUserData(null, user);
    dispatch(setToken(token));
    dispatch(setUser(user));
    await AsyncStorage.setItem("token", token);
    await AsyncStorage.setItem("user", user);
    await loadWindows(token);
    const languages = await getLanguages();
    dispatch(setStoredLanguages(languages.list));
    const currentLanguage = await AsyncStorage.getItem("selectedLanguage");
    const languageToSet = languages.isCurrentInlist
      ? currentLanguage
      : languageByDefault();
    const languageFormatted = formatLanguageUnderscore(languageToSet, true);
    await changeLanguage(languageFormatted, () =>
      dispatch(setLanguage(languageFormatted))
    );
  };

  const reloadUserData = async (storedToken?: string, username?: string) => {
    if (storedToken) {
      dispatch(setToken(storedToken));
      try {
        const selectedUrlStored = await AsyncStorage.getItem("selectedUrl");
        OBRest.init(new URL(selectedUrlStored), storedToken);
        OBRest.loginWithToken(storedToken);
        await loadWindows(storedToken);
      } catch (ignored) {}
    }

    let context = OBRest.getInstance().getOBContext();
    const dataUser = {
      username: username ? username : user,
      userId: context?.getUserId(),
      defaultRoleId: context?.getRoleId(),
      defaultWarehouseId: context?.getWarehouseId(),
      roleId: context?.getRoleId(),
      warehouseId: context?.getWarehouseId(),
      organization: context?.getOrganizationId(),
      client: context?.getClientId()
    };

    dispatch(setData(dataUser));
    await AsyncStorage.setItem("dataUser", JSON.stringify(dataUser));
  };

  // Savings
  const saveEnviromentsUrl = async (storedEnviromentsUrl) => {
    if (storedEnviromentsUrl) {
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
    await AsyncStorage.removeItem("selectedLanguage");
    await AsyncStorage.removeItem("isDeveloperMode");
    await DefaultPreference.set('token', null);
    await DefaultPreference.set('urlToFetchSubApps', null);

    if (isDemo) {
      await AsyncStorage.removeItem("baseUrl");
      await AsyncStorage.removeItem("selectedUrl");
      await AsyncStorage.removeItem("isDemoTry");
      dispatch(setSelectedUrl(null));
      dispatch(setIsDemo(false));
    }

    dispatch(setIsDeveloperMode(false));
    dispatch(setIsSubapp(false));
    dispatch(setToken(null));
    dispatch(setUser(null));
    dispatch(setData(null));
    dispatch(setStoredLanguages(null));
    dispatch(setLanguage(null));
    OBRest.init(new URL("#"), null);
    await eraseItems();
    await languageDefault();
    await atAppInit();
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
