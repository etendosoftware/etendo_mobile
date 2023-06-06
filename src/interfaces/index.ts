
export interface INavigation {
  push(windowId: string, param: object);
  closeDrawer();
  navigate(name: string, params?: any);
  toggleDrawer();
  goBack();
}