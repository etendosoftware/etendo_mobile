import { StyleSheet } from "react-native";
import {
  NEUTRAL_10,
  NEUTRAL_100,
  NEUTRAL_30,
  NEUTRAL_60,
  NEUTRAL_80,
  PRIMARY_100,
  TERCIARY_100,
  TERCIARY_50,
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
  backContainerTablet: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 40
  },
  backContainerMobile: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 28
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
    paddingRight: 20,
    borderColor: NEUTRAL_30,
    justifyContent: "space-between",
    marginRight: 20
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
  dialogNewUrl: {
    backgroundColor: TERCIARY_50,
    width: "50%",
    alignSelf: "center",
    justifySelf: "center",
    borderRadius: 24,
    padding: 30
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
    paddingLeft: 20
  },
  languageText: {
    fontFamily: "Inter-SemiBold",
    color: NEUTRAL_60,
    fontSize: 12,
    lineHeight: 18,
    paddingBottom: 8
  },
  urlEnvList: {
    fontFamily: "Inter-Bold",
    color: PRIMARY_100,
    fontSize: 18,
    lineHeight: 18,
    paddingBottom: 8,
    fontWeight: "600"
  },
  notUrlEnvList: {
    fontFamily: "Inter-Bold",
    color: NEUTRAL_80,
    fontSize: 18,
    lineHeight: 18,
    fontWeight: "500"
  },
  urlItem: {
    width: "100%",
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 16,
    borderWidth: 1,
    border: PRIMARY_100,
    backgroundColor: NEUTRAL_100
  },
  urlItemBackgroundFilled: {
    backgroundColor: TERCIARY_100
  },
  urlItemContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    height: "100%"
  },
  urlItemContainerElem: {
    marginHorizontal: 8,
    width: "75%"
  },
  dialogTitle: {
    fontFamily: "Inter-Bold",
    color: PRIMARY_100,
    lineHeight: 18,
    paddingBottom: 8,
    fontWeight: "800"
  },
  dialogContent: {
    justifyContent: "center",
    alignItems: "center"
  },
  copyrightTablet: {
    flex: 1,
    position: "absolute",
    bottom: 68,
    left: 32
  }
});

export default styles;
