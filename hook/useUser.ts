import { OBRest } from "etrest";
import { useAppDispatch, useAppSelector } from "../redux";
import {
  selectSelectedLanguage,
  selectStoredEnviromentsUrl,
  selectToken,
  selectUser,
  setData,
  setLanguage,
  setStoredEnviromentsUrl,
  setToken,
  setUser
} from "../redux/user";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getServerLanguages } from "../src/helpers/getLanguajes";

export const useUser = () => {
  const dispatch = useAppDispatch();
  const selectedLanguage = useAppSelector(selectSelectedLanguage);
  const storedEnviromentsUrl = useAppSelector(selectStoredEnviromentsUrl);
  const token = useAppSelector(selectToken);
  const user = useAppSelector(selectUser);

  const login = async (user, pass) => {
    try {
      await OBRest.loginWithUserAndPassword(user, pass);
    } catch (ignored) {}

    // TODO: this should be changed to a boolean isLoggedIn
    const token = OBRest.getInstance()
      .getAxios()
      .defaults.headers.Authorization.replace("Bearer ", "");
    const currentLanguage = await AsyncStorage.getItem("selectedLanguage");
    const currentEnviromentsUrl = await loadEnviromentsUrl();
    dispatch(setToken(token));
    dispatch(setUser(user));
    dispatch(setLanguage(currentLanguage));
    dispatch(setStoredEnviromentsUrl(currentEnviromentsUrl));

    await reloadUserData(null, user);

    await AsyncStorage.setItem("token", token);
    await AsyncStorage.setItem("user", user);
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

    dispatch(setLanguage(loadLanguage()));
    dispatch(setStoredEnviromentsUrl(loadEnviromentsUrl()));
    // console.log("getServerLanguages()", await getServerLanguages());
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

  return {
    login,
    reloadUserData,
    saveEnviromentsUrl,
    saveToken,
    loadEnviromentsUrl,
    loadLanguage,
    setCurrentLanguage
  };
};
