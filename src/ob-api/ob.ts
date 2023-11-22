import { OBRest } from "etrest";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SUCCESS = 0;
const FORBIDDEN = 1;
const ERROR = 2;
const NOT_FOUND = 3;

const setUrl = async (_url?) => {
  let url = _url
    ? formatUrl(_url.trim())
    : await AsyncStorage.getItem("baseUrl");
  if (url) {
    await AsyncStorage.setItem("baseUrl", url);
    // @ts-ignore
    OBRest.init({ href: url });
  }
  return url;
};

const formatUrl = (_url?) => {
  let url = _url;
  if (url) {
    if (url && !url.startsWith("http://") && !url.startsWith("https://")) {
      url = "http://" + url;
    }
  }
  return url;
};

export const formatEnvironmentUrl = (url: string) => {
  if (typeof url === "string") {
    const thirdSlashIndex = url.indexOf("/", url.indexOf("//") + 2);

    if (thirdSlashIndex !== -1) {
      return url.substring(0, thirdSlashIndex);
    }

    return url;
  }

  return "";
};

const getUrl = async () => {
  return AsyncStorage.getItem("baseUrl");
};

const resetLocalUrl = async () => {
  return AsyncStorage.removeItem("baseUrl");
};

export {
  getUrl,
  formatUrl,
  setUrl,
  resetLocalUrl,
  SUCCESS,
  NOT_FOUND,
  FORBIDDEN,
  ERROR
};
