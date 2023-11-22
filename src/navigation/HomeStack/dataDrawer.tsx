import React from "react";
import { HomeIcon } from "etendo-ui-library/dist-native/assets/images/icons/HomeIcon";
import { DrawerDataContentType } from "etendo-ui-library/dist-native/components/navbar/Navbar.types";
import locale from "../../i18n/locale";

export const drawerData = (dataDrawer: any): DrawerDataContentType[] => {
  return [
    {
      sectionType: "sections",
      dataSection: [{ route: "Home", label: "Home", image: <HomeIcon /> }]
    },
    {
      sectionType: "sections",
      dataSection: dataDrawer,
      titleSection: locale.t("Drawer:Applications")
    }
  ];
};
