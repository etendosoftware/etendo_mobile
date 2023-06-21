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

  NotItemList: styleSheet.NotItemList,
  container: styleSheet.container,
  backContainer: styleSheet.backContainer,
  settingsTitle: styleSheet.settingsTitle,
  urlTextsContainer: styleSheet.urlTextsContainer,
  urlTitle: styleSheet.urlTitle,
  urlDescription: styleSheet.urlDescription,
  CahngeUrlTextConfirmation: styleSheet.CahngeUrlTextConfirmation,
  languageText: styleSheet.languageText,
  copyrightTablet: styleSheet.copyrightTablet,
  backIcon: styleSheet.backIcon
};
