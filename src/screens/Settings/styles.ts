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
    width: "100%"
  },
  backContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 80
  },
  settingsTitle: {
    fontFamily: "Inter-SemiBold",
    fontWeight: "600",
    fontSize: 28,
    lineHeight: 36,
    color: PRIMARY_100,
    paddingRight: 20,
    paddingLeft: 24
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
  containerCard: {
    backgroundColor: NEUTRAL_100,
    marginTop: 24,
    marginLeft: 24,
    marginRight: 24,
    borderRadius: 8,
    flexDirection: "column"
  },
  containerCardTablet: {
    backgroundColor: NEUTRAL_100,
    margin: 24,
    flexDirection: "row",
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 16
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
  urlTextsContainer: {
    marginBottom: 16
  },
  urlContainer: {
    flexDirection: "column",
    marginHorizontal: 20,
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderColor: NEUTRAL_30
  },
  urlContainerTablet: {
    width: "33%",
    flexDirection: "column",
    borderRightWidth: 1,
    borderColor: NEUTRAL_30,
    justifyContent: "space-between"
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
    fontSize: 12
  },
  logoContainer: {
    borderBottomWidth: 1,
    borderBottomColor: NEUTRAL_30,
    marginHorizontal: 20,
    paddingVertical: 24
  },
  logoContainerTablet: {
    borderRightWidth: 1,
    borderColor: NEUTRAL_30,
    width: "33%",
    paddingHorizontal: 20
  },
  logoTitle: {
    fontSize: 12,
    marginBottom: 16,
    fontWeight: "bold",
    color: NEUTRAL_60
  },
  logoTitleTablet: {
    fontSize: 12,
    fontWeight: "bold",
    color: NEUTRAL_60,
    paddingBottom: 8
  },
  logoImage: {
    resizeMode: "contain"
  },
  logoImageTablet: {
    width: "80%"
  },
  languageContainer: {
    marginVertical: 24,
    marginHorizontal: 20,
    fontFamily: "Inter-SemiBold"
  },
  languageContainerTablet: {
    width: "33%",
    paddingHorizontal: 20
  },
  languageText: {
    fontFamily: "Inter-SemiBold",
    color: NEUTRAL_60,
    fontSize: 12,
    lineHeight: 18,
    paddingBottom: 8
  },
  copyrightTablet: {
    flex: 1,
    position: "absolute",
    bottom: 68,
    left: 32
  }
});

export default styles;
