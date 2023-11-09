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

export interface ILanguage {
  id: string;
  value: string;
  label: string;
}

export interface IData {
  username: string;
  userId: string;
  defaultRoleId: string;
  defaultWarehouseId: string;
  roleId: string;
  warehouseId: string;
  organization: string;
  client: string;
}

export interface IFetchComponent {
  id: string;
  url: string;
  navigation: {
    navigate: (screen: string) => void;
  };
}

export interface IDynamicComponentProps {
  __id: string;
  url: string;
  isDev?: boolean;
  navigationContainer: {
    navigate: (screen: string) => void;
  };
  children?: React.ReactNode;
  dataUser: any;
  token: string;
  user: string;
  language: string;
}
