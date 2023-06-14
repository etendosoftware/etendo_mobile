import { StyleSheet } from "react-native";
import {
  NEUTRAL_10,
  NEUTRAL_100,
  NEUTRAL_30,
  NEUTRAL_60,
  PRIMARY_100,
  WHITE
} from "../../styles/colors";
import { defaultTheme } from "../../themes";

const styles = StyleSheet.create({
  container: {
    backgroundColor: WHITE,
    height: "100%"
  },
  image: {
    flex: 1,
    width: "100%",
    marginTop: 25
  },
  header: {
    backgroundColor: PRIMARY_100,
    marginTop: 48
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
    flexDirection: "row"
  },
  settingsTitle: {
    fontFamily: "Inter-SemiBold",
    fontWeight: "600",
    fontSize: 28,
    lineHeight: 36,
    color: PRIMARY_100,
    paddingRight: 20,
    marginBottom: -15
  },
  backIcon: {
    height: 16,
    width: 16,
    marginRight: 8
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
  containerCard: {
    backgroundColor: NEUTRAL_100,
    marginTop: 24,
    marginLeft: 24,
    marginRight: 24,
    borderRadius: 8,
    flexDirection: "row"
  },
  containerCardTablet: {
    backgroundColor: NEUTRAL_100,
    display: "flex",
    marginTop: 24,
    marginLeft: 24,
    marginRight: 24,
    flexDirection: "row",
    width: "97%",
    height: "18%",
    borderRadius: 8
  },
  listSection: {
    width: "100%",
    fontSize: 20,
    display: "flex",
    flexDirection: "column"
  },
  listSectionTablet: {
    fontSize: 20,
    display: "flex",
    flexDirection: "row",
    height: "100%",
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginVertical: 0,
    width: "100%"
  },
  NotItemList: {
    color: defaultTheme.colors.textSecondary,
    fontSize: 15,
    textAlign: "center",
    textAlignVertical: "center",
    height: 150
  },
  listItem: {
    marginLeft: -15
  },
  listItemTablet: {
    marginLeft: -15,
    marginTop: -20
  },
  buttonCahngeUrl: {
    marginBottom: 24
  },
  urlContainer: {
    display: "flex",
    flexDirection: "column",
    borderBottomWidth: 1,
    borderColor: NEUTRAL_30,
    marginHorizontal: 20
  },
  urlContainerTablet: {
    width: "33%",
    borderRightWidth: 1,
    borderColor: NEUTRAL_30
  },
  urlTitle: {
    fontFamily: "Inter-SemiBold",
    color: NEUTRAL_60,
    fontWeight: "600",
    fontSize: 12
  },
  urlDescription: {
    fontFamily: "Inter-SemiBold",
    fontWeight: "500",
    color: NEUTRAL_10,
    lineHeight: 22,
    fontSize: 14
  },
  CahngeUrlTextConfirmation: {
    color: NEUTRAL_60,
    fontFamily: "Inter-SemiBold",
    fontWeight: "600",
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 28
  },
  logoContainer: {
    borderBottomWidth: 1,
    borderBottomColor: NEUTRAL_30,
    marginLeft: 20,
    marginRight: 20
  },
  logoContainerTablet: {
    borderRightWidth: 1,
    borderColor: NEUTRAL_30,
    width: "33%",
    paddingHorizontal: 20,
    paddingVertical: 0
  },
  logoTitle: {
    marginLeft: -15,
    fontSize: 12,
    fontWeight: "bold",
    color: NEUTRAL_60
  },
  logoTitleTablet: {
    marginLeft: -15,
    marginTop: -18,
    fontSize: 12,
    fontWeight: "bold",
    color: NEUTRAL_60
  },
  logoImage: {
    height: 80,
    resizeMode: "contain",
    marginBottom: 28
  },
  logoImageTablet: {
    width: "80%",
    paddingLeft: 60
  },
  languageContainer: {
    marginTop: 28,
    marginHorizontal: 20,
    fontFamily: "Inter-SemiBold"
    // width: "33%"
  },
  languageContainerTablet: {
    width: "33%",
    paddingHorizontal: 20
  },
  languageText: {
    marginBottom: -17,
    marginLeft: 2,
    fontFamily: "Inter-SemiBold",
    color: NEUTRAL_60,
    fontSize: 12,
    lineHeight: 18
  },
  languageTextTablet: {
    marginBottom: -17,
    marginLeft: 2,
    top: -5,
    fontFamily: "Inter-SemiBold",
    color: NEUTRAL_60,
    fontSize: 12,
    lineHeight: 18
  },
  copyrightTablet: {
    position: "absolute",
    bottom: 41,
    left: 52
  }
});

export default styles;
