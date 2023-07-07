import { StyleSheet, StatusBar } from "react-native";
import {
  NEUTRAL_100,
  NEUTRAL_30,
  NEUTRAL_60,
  PRIMARY_100,
  WHITE
} from "../../styles/colors";

const styleSheet = StyleSheet.create({
  fullContainer: {
    backgroundColor: WHITE,
    height: "100%"
  },
  imageHeader: {
    resizeMode: "stretch",
    width: "100%",
    zIndex: -1,
    position: "relative"
  },
  imageHeaderTablet: {
    resizeMode: "stretch",
    width: "102%",
    zIndex: -1,
    position: "absolute",
    justifyContent: "center",
    alignItems: "center"
  },
  pageTitleMobile: {
    marginTop: 24,
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
    marginBottom: 24
  },
  pageTitleTablet: {
    marginTop: 40,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    marginLeft: 32
  },
  profileTitleMobile: {
    fontFamily: "Inter-SemiBold",
    fontWeight: "600",
    fontSize: 28,
    lineHeight: 36,
    color: PRIMARY_100,
    paddingRight: 20,
    paddingLeft: 24
  },
  profileTitleTablet: {
    fontFamily: "Inter-SemiBold",
    fontWeight: "600",
    fontSize: 28,
    lineHeight: 36,
    color: PRIMARY_100,
    paddingRight: 20
  },
  navbarTablet: {
    marginTop: 24,
    backgroundColor: PRIMARY_100
  },
  userData: {
    alignItems: "center",
    alignSelf: "center",
    position: "absolute",
    marginTop: 180 - StatusBar.currentHeight,
    flex: 1
  },
  userDataTablet: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    alignContent: "space-around",
    marginLeft: 32
  },
  profilePicture: {
    height: 140,
    zIndex: 1
  },
  profilePictureTablet: {
    paddingRight: 19
  },

  usernameTextMobile: {
    fontFamily: "Inter-SemiBold",
    fontWeight: "600",
    fontSize: 28,
    lineHeight: 36,
    color: PRIMARY_100,
    marginTop: 16
  },
  usernameTextTablet: {
    fontFamily: "Inter-SemiBold",
    fontWeight: "600",
    fontSize: 28,
    lineHeight: 36,
    color: PRIMARY_100,
    marginTop: 62
  },
  accountDataContainer: {
    marginTop: 75
  },
  informationCardTablet: {
    display: "flex",
    flexDirection: "row",
    width: "95%",
    marginHorizontal: 32,
    paddingHorizontal: 20,
    backgroundColor: NEUTRAL_100,
    borderRadius: 8
  },
  individualInfoContainerTablet: {
    width: "25%",
    borderRightWidth: 1,
    borderRightColor: NEUTRAL_30,
    marginVertical: 9,
    marginRight: 20
  },
  lastInfoContainerTablet: {
    width: "25%",
    marginVertical: 9
  },
  accountDataContainerMobile: {
    marginTop: 260,
    marginHorizontal: 24
  },
  accountTitle: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    fontSize: 12,
    fontFamily: "Inter-Regular",
    lineHeight: 18,
    color: NEUTRAL_60,
    marginBottom: 8
  },
  accountTitleTablet: {
    display: "flex",
    marginLeft: 32,
    marginTop: 44,
    marginBottom: 8,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    fontSize: 12,
    fontFamily: "Inter-Regular",
    lineHeight: 18
  },
  backIcon: {
    height: 16,
    width: 16,
    marginRight: 8
  },
  itemListStyleMobile: {
    width: "100%",
    fontFamily: "Inter-SemiBold",
    backgroundColor: NEUTRAL_100,
    paddingHorizontal: 20,
    borderRadius: 8
  },
  titleStyle: {
    fontFamily: "Inter-SemiBold",
    fontWeight: "600",
    fontSize: 12,
    lineHeight: 18,
    paddingTop: 16
  },
  descriptionStyle: {
    fontFamily: "Inter-Regular",
    color: NEUTRAL_60,
    fontWeight: "500",
    fontSize: 14,
    lineHeight: 22,
    borderBottomWidth: 1,
    borderBottomColor: NEUTRAL_30,
    paddingBottom: 16
  },
  descriptionStyleTablet: {
    fontFamily: "Inter",
    fontWeight: "500",
    fontSize: 14,
    lineHeight: 22
  },
  descriptionStyleLast: {
    fontFamily: "Inter-Regular",
    color: NEUTRAL_60,
    fontWeight: "500",
    fontSize: 14,
    lineHeight: 22,
    paddingBottom: 16
  }
});

export default styleSheet;
