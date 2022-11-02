import React, { useMemo } from 'react';

export class EtendoUtil {
  private _state: any;
  private _dispatch: any;
  private _screens: any = [];
  private _Stack: any;

  public set state(state: any) {
    this._state = state;
  }
  public set dispatch(dispatch: any) {
    this._dispatch = dispatch;
  }
  public set Stack(Stack: any) {
    this._Stack = Stack;
  }

  public addMenuItem(menuItems: [{
    name: string;
    __id: string;
    url: string;
    isDev: boolean;
    component: any;
  }]) {
    const add: any[] = []
    menuItems.map(menuItem => {
      if (
        this._state.menuItems.filter(it => {
          return it.name === menuItem.name;
        }).length == 0
      ) {
        add.push(menuItem)
      }
    })
    this._dispatch({ menuItems: [...this._state.menuItems, ...add] });
  }

  public register(name: string, component: any) {
    this._screens = component;
  }

  public render(name: string) {
    const Component = useMemo(() => {
      return React.lazy(async () => { return this._screens.default })
    }, [name]);
    return (<Component />);
  }

  public screen = "Screen2"

  public createStackNavigator() {
    return this._Stack;
  }

}

const Etendo = new EtendoUtil();

export { Etendo };
