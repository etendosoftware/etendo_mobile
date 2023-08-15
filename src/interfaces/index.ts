export interface INavigation {
  push(windowId: string, param: object);
  closeDrawer();
  navigate(name: string, params?: any);
  toggleDrawer();
  goBack();
}
export interface IRoute {
  name: string;
  key: string;
  label: string;
  reset?: boolean;
  params: {
    key: string;
  }[];
}

export interface ISelectPicker {
  value: string;
}
