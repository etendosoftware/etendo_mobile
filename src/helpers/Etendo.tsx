import React, { useMemo } from "react";

export class EtendoUtil {
  private _state: any;
  private _dispatch: any;
  private _screens: any = [];
  private _Stack: any;
  private _url: string = "";
  private _token: string = "token";
  private _navigation = [];
  private _globalNav: any;

  public set state(state: any) {
    this._state = state;
  }
  public set dispatch(dispatch: any) {
    this._dispatch = dispatch;
  }
  public set Stack(Stack: any) {
    this._Stack = Stack;
  }
  public set url(url: string) {
    this._url = url;
  }
  public get url() {
    return this._url;
  }
  public set token(token: string) {
    this._token = token;
  }
  public get token() {
    return this._token;
  }
  public get navigation() {
    return this._navigation;
  }
  public get globalNav() {
    return this._globalNav;
  }
  public set globalNav(globalNav: any) {
    this._globalNav = globalNav;
  }
  public addMenuItem(
    menuItems: [
      {
        name: string;
        __id: string;
        url: string;
        isDev: boolean;
        component: any;
      }
    ]
  ) {
    console.log("addMenuItem", menuItems);
    const add: any[] = [];
    menuItems.map(menuItem => {
      let replaced = false;
      for (let i = 0; i < this._state.menuItems.length; i++) {
        if (menuItem.name === this._state.menuItems[i].name) {
          this._state.menuItems[i] = menuItem;
          replaced = true;
        }
      }
      if (!replaced) {
        add.push(menuItem);
      }
    });
    this._dispatch({ menuItems: [...this._state.menuItems, ...add] });
  }

  public register(name: string, component: any) {
    this._screens = component;
  }

  public render(name: string) {
    const Component = useMemo(() => {
      return React.lazy(async () => {
        return this._screens.default;
      });
    }, [name]);
    return <Component />;
  }

  public screen = "Screen2";

  public createStackNavigator() {
    return this._Stack;
  }

  public async closeDrawer() {
    this._globalNav.closeDrawer();
  }
  public async toggleDrawer() {
    this._globalNav.toggleDrawer();
  }
}

const Etendo = new EtendoUtil();

export { Etendo };
