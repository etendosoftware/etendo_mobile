import { isDeviceTablet } from "../../../hook/isTablet";
import styleSheet from "./styles";

export const deviceStyles = {
  // Styles for both mobile and tablet
  configurationImage: styleSheet.configurationImage,
  backgroundHeaderImage: styleSheet.backgroundHeaderImage,
  containerInputs: styleSheet.containerInputs,
  textInputStyle: styleSheet.textInputStyle,
  textInputsHolders: styleSheet.textInputsHolders,
  welcomeTitle: styleSheet.welcomeTitle,
  starsImage: styleSheet.starsImage,
  backgroundLoginImageContainer: styleSheet.backgroundLoginImageContainer,
  backgroundLoginImage: styleSheet.backgroundLoginImage,
  buttonDemo: styleSheet.buttonDemo,

  // Styles specific to mobile or tablet
  loginButton: !isDeviceTablet && styleSheet.loginButton,
  container: isDeviceTablet
    ? styleSheet.containerTablet
    : styleSheet.containerMobile,
  buttonsDemoSettings: isDeviceTablet
    ? styleSheet.buttonsDemoSettingsTablet
    : styleSheet.buttonsDemoSettings,
  etendoLogoContainer: isDeviceTablet
    ? styleSheet.etendoLogoContainerTablet
    : styleSheet.etendoLogoContainerMobile,
  etendoLogotype: isDeviceTablet
    ? styleSheet.etendoLogotypeTablet
    : styleSheet.etendoLogotypeMobile,
  copyRightStyle: isDeviceTablet
    ? styleSheet.copyRightStyle
    : styleSheet.copyRightStyleMobile,
  credentialsText: isDeviceTablet
    ? styleSheet.credentialsTextTabletM
    : styleSheet.credentialsTextMobile,
  generalContainer: isDeviceTablet
    ? styleSheet.generalContainerTablet
    : styleSheet.generalContainerMobile,
  backgroundContainer: isDeviceTablet
    ? styleSheet.backgroundContainerTablet
    : styleSheet.backgroundContainerMobile,
  settingsImageContainer: isDeviceTablet
    ? styleSheet.settingsImageContainerTablet
    : styleSheet.settingsImageContainerMobile,
  changePasswordStyle: isDeviceTablet
    ? styleSheet.changePasswordTablet
    : styleSheet.changePasswordMobile
};
