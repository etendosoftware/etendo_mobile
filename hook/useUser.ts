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

export const useUser = () => {
  const dispatch = useAppDispatch();
  const selectedLanguage = useAppSelector(selectSelectedLanguage);
  const storedEnviromentsUrl = useAppSelector(selectStoredEnviromentsUrl);
  const token = useAppSelector(selectToken);
  const user = useAppSelector(selectUser);

  const login = async (user, pass) => {
    await OBRest.loginWithUserAndPassword(user, pass);

    // TODO: this should be changed to a boolean isLoggedIn
    const token = OBRest.getInstance()
      .getAxios()
      .defaults.headers.Authorization.replace("Bearer ", "");
    const currentLanguage = await loadLanguage();
    const currentEnviromentsUrl = await loadEnviromentsUrl();
    console.log("token", token);
    dispatch(setToken(token));
    dispatch(setUser(user));
    dispatch(setLanguage(currentLanguage));
    dispatch(setStoredEnviromentsUrl(currentEnviromentsUrl));

    await reloadUserData();
  };

  const reloadUserData = async (storedToken?) => {
    if (storedToken) {
      dispatch(setToken(storedToken));
      OBRest.loginWithToken(storedToken);
    }

    let context = OBRest.getInstance().getOBContext();

    dispatch(
      setData({
        username: user,
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
  };

  // Savings
  const saveEnviromentsUrl = async (storedEnviromentsUrl) => {
    if (storedEnviromentsUrl && storedEnviromentsUrl.length) {
      dispatch(setStoredEnviromentsUrl(storedEnviromentsUrl));
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

  return {
    login,
    reloadUserData,
    saveEnviromentsUrl,
    saveToken,
    loadEnviromentsUrl,
    loadLanguage
  };
};
