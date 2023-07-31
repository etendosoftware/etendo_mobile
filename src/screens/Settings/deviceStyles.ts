import { isDeviceTablet } from "../../../hook/isTablet";
import styleSheet from "./styles";

export const deviceStyles = {
  containerCardStyle: isDeviceTablet
    ? styleSheet.containerCardTablet
    : styleSheet.containerCard,
  containerUrlStyle: isDeviceTablet
    ? styleSheet.urlContainerTablet
    : styleSheet.urlContainer,
  logoContainerStyles: isDeviceTablet
    ? styleSheet.logoContainerTablet
    : styleSheet.logoContainer,
  languageContainerStyles: isDeviceTablet
    ? styleSheet.languageContainerTablet
    : styleSheet.languageContainer,
  logoImageStyles: isDeviceTablet
    ? styleSheet.logoImageTablet
    : styleSheet.logoImage,
  logoTitleStyles: isDeviceTablet
    ? styleSheet.logoTitleTablet
    : styleSheet.logoTitle,
  backContainer: isDeviceTablet
    ? styleSheet.backContainerTablet
    : styleSheet.backContainerMobile,
  dialogNewUrl: isDeviceTablet
    ? styleSheet.dialogNewUrlTablet
    : styleSheet.dialogNewUrl,
  containerClose: isDeviceTablet
    ? styleSheet.containerCloseTablet
    : styleSheet.containerClose,
  listUrlItems: isDeviceTablet
    ? styleSheet.listUrlItemsTablet
    : styleSheet.listUrlItems,
  urlItemContainerElem: isDeviceTablet
    ? styleSheet.urlItemContainerElemTablet
    : styleSheet.urlItemContainerElem,
  NotItemList: styleSheet.NotItemList,
  container: styleSheet.container,
  settingsTitle: styleSheet.settingsTitle,
  urlTextsContainer: styleSheet.urlTextsContainer,
  urlTitle: styleSheet.urlTitle,
  urlDescription: styleSheet.urlDescription,
  CahngeUrlTextConfirmation: styleSheet.CahngeUrlTextConfirmation,
  languageText: styleSheet.languageText,
  urlEnvList: styleSheet.urlEnvList,
  dialogTitle: styleSheet.dialogTitle,
  dialogContent: styleSheet.dialogContent,
  notUrlEnvList: styleSheet.notUrlEnvList,
  urlItem: styleSheet.urlItem,
  urlItemBackgroundFilled: styleSheet.urlItemBackgroundFilled,
  urlItemContainer: styleSheet.urlItemContainer,
  actionIcon: styleSheet.actionIcon,
  buttonClose: styleSheet.buttonClose,

  copyrightTablet: styleSheet.copyrightTablet,
  backIcon: styleSheet.backIcon
};
