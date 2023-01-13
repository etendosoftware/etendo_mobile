import { createStackNavigator } from '@react-navigation/stack';
import React, { useReducer } from 'react';
import {Etendo, EtendoUtil} from '../helpers/Etendo';
import { getUrl } from '../ob-api/ob';

export const DEV_URL = "http://10.0.2.2:3000"
const ContainerContext = React.createContext<{ state: any, dispatch: any, Etendo: EtendoUtil }>({});

const ContainerProvider = ({ children }: any) => {
  const reducer = (state: any, action: any) => {
    if (action.appsData) {
      /* For each app added, add a new menu item */
      const mi = action.appsData.map((app: any) => {
        const path = app.path.split("/")
        const __id = app.etdappAppVersionIsDev ? path[path.length - 1] : app.path
        return {
          name: app.etdappAppName,
          __id: __id,
          url: app.etdappAppVersionIsDev ? `${DEV_URL}` : state.url,
          isDev: app.etdappAppVersionIsDev
        }
      })
      action.menuItems = [...state.menuItems, ...mi]
    }
    return { ...state, ...action }
  }
  
  const initialState = {
    appsData: [],
    menuItems: [],
    url: "",
    logged: false,
  };
  getUrl().then(url => {dispatch({url: url})});

  const [state, dispatch] = useReducer(reducer, initialState);
  Etendo.state = state;
  Etendo.dispatch = dispatch;
  Etendo.Stack = createStackNavigator();

  return (
    <ContainerContext.Provider value={{ state, dispatch, Etendo }}>
      {children}
    </ContainerContext.Provider>
  );
};

export { ContainerContext, ContainerProvider }
