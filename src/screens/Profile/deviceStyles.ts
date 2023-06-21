import { isDeviceTablet } from "../../../hook/isTablet";
import styleSheet from "./styles";

export const deviceStyles = {
  getProfilePictureStyle: isDeviceTablet
    ? styleSheet.profilePictureTablet
    : styleSheet.profilePicture,
  getUserDataStyle: isDeviceTablet
    ? styleSheet.userDataTablet
    : styleSheet.userData,
  imageHeader: isDeviceTablet
    ? styleSheet.imageHeaderTablet
    : styleSheet.imageHeader,
  accountDataContainer: isDeviceTablet
    ? styleSheet.accountDataContainer
    : styleSheet.accountDataContainerMobile,
  accountTitleStyle: isDeviceTablet
    ? styleSheet.accountTitleTablet
    : styleSheet.accountTitle,
  getDescriptionStyle: isDeviceTablet
    ? styleSheet.descriptionStyleTablet
    : styleSheet.descriptionStyle,
  getinformationCardStyle: isDeviceTablet
    ? styleSheet.informationCardTablet
    : styleSheet.itemListStyleMobile,
  pageTitleStyle: isDeviceTablet
    ? styleSheet.pageTitleTablet
    : styleSheet.pageTitleMobile,
  profileTitleStyle: isDeviceTablet
    ? styleSheet.profileTitleTablet
    : styleSheet.profileTitleMobile,
  userNameStyle: isDeviceTablet
    ? styleSheet.usernameTextTablet
    : styleSheet.usernameTextMobile,
  individualInfoContainerStyle: isDeviceTablet
    ? styleSheet.individualInfoContainerTablet
    : null,
  lastInfoContainerStyle: isDeviceTablet
    ? styleSheet.lastInfoContainerTablet
    : null,

  fullContainer: styleSheet.fullContainer,
  backIcon: styleSheet.backIcon,
  titleStyle: styleSheet.titleStyle,
  descriptionStyleLast: styleSheet.descriptionStyleLast
};
