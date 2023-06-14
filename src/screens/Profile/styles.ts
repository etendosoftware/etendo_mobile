import { StyleSheet } from "react-native";
import {
  NEUTRAL_100,
  NEUTRAL_30,
  NEUTRAL_60,
  PRIMARY_100,
  TERCIARY_100
} from "../../styles/colors";
import { defaultTheme } from "../../themes";

const styles = StyleSheet.create({
  fullContainer: {
    backgroundColor: defaultTheme.colors.background,
    height: "100%"
  },
  imageHeader: {
    resizeMode: "stretch",
    width: "100%"
  },
  accountContainer: {
    top: -120
  },
  header: {
    marginTop: 48
  },
  imageHeaderTablet: {
    resizeMode: "stretch",
    width: "100%",
    top: -57,
    zIndex: -2
  },
  navbarTablet: {
    marginTop: 24,
    backgroundColor: PRIMARY_100
  },
  breadCumsTablet: {
    height: 32,
    marginTop: 24,
    marginLeft: 32,
    display: "flex",
    alignItems: "center",
    flexDirection: "row"
  },
  profileTitle: {
    fontFamily: "Inter-SemiBold",
    fontWeight: "600",
    fontSize: 28,
    lineHeight: 36,
    color: PRIMARY_100,
    paddingRight: 20
  },
  arrowStyle: {
    width: 10,
    height: 10,
    paddingHorizontal: 20,
    marginVertical: 12
  },
  homeStyle: {
    height: 20,
    top: 6
  },
  backgroundMobile: {
    width: "100%",
    height: "50%",
    position: "absolute",
    top: "70%",
    zIndex: -1
  },
  backgroundTablet: {
    width: "70%",
    height: "100%",
    position: "absolute",
    top: "70%",
    left: "0%",
    zIndex: -1
  },
  containerMobile: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "auto"
  },
  containerTablet: {
    flexDirection: "row-reverse",
    justifyContent: "center",
    alignItems: "center",
    top: "5%"
  },
  userData: {
    alignItems: "center",
    marginTop: 40,
    width: "50%"
  },
  userDataTablet: {
    display: "flex",
    alignItems: "center",
    left: 485,
    top: -50,
    flexDirection: "row",
    alignContent: "space-around"
  },
  profilePicture: {
    height: 140,
    alignItems: "center"
  },
  profilePictureTablet: {
    paddingRight: 19
  },
  usernameText: {
    fontFamily: "Inter-SemiBold",
    fontWeight: "600",
    fontSize: 28,
    lineHeight: 36,
    color: PRIMARY_100,
    marginTop: 16,
    marginBottom: -16
  },
  userNameContainer: {
    justifyContent: "center",
    height: 40
  },
  userNameContainerTablet: {
    marginTop: 38,
    fontFamily: "Inter-Bold",
    fontWeight: "600",
    fontSize: 28,
    lineHeight: 36
  },
  accountDataContainer: {
    marginTop: 52
  },
  informationCard: {
    marginHorizontal: 24,
    alignItems: "center",
    backgroundColor: NEUTRAL_100,
    padding: 15,
    borderRadius: 8
  },
  informationCardTablet: {
    display: "flex",
    flexDirection: "row",
    width: "95%",
    marginHorizontal: 32,
    backgroundColor: NEUTRAL_100,
    borderRadius: 8
  },
  informationContainerTablet: {
    width: "50%",
    alignItems: "center"
  },
  accountTitle: {
    display: "flex",
    marginLeft: 24,
    marginTop: 44,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    fontSize: 12,
    fontFamily: "Inter-Regular",
    lineHeight: 18,
    color: NEUTRAL_60
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
  itemListStyleTablet: {
    width: "26%",
    left: -20,
    fontFamily: "Inter-SemiBold",
    borderRightWidth: 1,
    borderRightColor: NEUTRAL_30,
    marginVertical: 5,
    display: "flex",
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    paddingLeft: 16
  },
  itemListStyleLastTablet: {
    width: "26%",
    fontFamily: "Inter-SemiBold"
  },
  itemListStyleFirst: {
    width: "26%",
    fontFamily: "Inter-SemiBold",
    left: -20,
    borderRightWidth: 1,
    borderRightColor: NEUTRAL_30,
    marginVertical: 5,
    display: "flex",
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center"
  },
  backIcon: {
    height: 16,
    width: 16,
    marginRight: 8
  },
  itemListStyleMobile: {
    width: "100%",
    fontFamily: "Inter-SemiBold"
  },
  titleStyle: {
    fontFamily: "Inter-SemiBold",
    fontWeight: "600",
    fontSize: 12,
    lineHeight: 18
  },
  descriptionStyle: {
    fontFamily: "Inter",
    fontWeight: "500",
    fontSize: 14,
    lineHeight: 22,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: NEUTRAL_30
  },
  descriptionStyleTablet: {
    fontFamily: "Inter",
    fontWeight: "500",
    fontSize: 14,
    lineHeight: 22
  },
  descriptionStyleLast: {
    fontFamily: "Inter",
    fontWeight: "500",
    fontSize: 14,
    lineHeight: 22
  }
});

export default styles;
