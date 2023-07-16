import { createContext } from "react";

type IMainAppContext = {
  selectedLanguage?: any;
  changeLanguage?: any;
  languages?: any[];
  updateLanguageList?: any;
  setToken?: any;
  token: any;
};

export enum APP_EVENT {
  RECORD_UPDATE
}

const MainAppContext = createContext<IMainAppContext>({});

export default MainAppContext;
