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
  fullContainer: {
    flex: 1,
    backgroundColor: WHITE
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
    justifyContent: "flex-start",
    marginRight: 20
  },
  containerAddLinkStyle: {
    alignSelf: "flex-start",
    marginTop: 16
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
    width: "85%",
    height: 525,
    alignSelf: "center",
    justifySelf: "center",
    borderRadius: 24,
    paddingBottom: 130,
    paddingHorizontal: 10
  },
  dialogNewUrlTablet: {
    backgroundColor: TERCIARY_50,
    width: 580,
    height: 570,
    alignSelf: "center",
    justifySelf: "center",
    borderRadius: 24,
    paddingHorizontal: 30,
    paddingTop: 35,
    paddingBottom: 120
  },
  listUrlItemsTablet: {
    height: "48%",
    marginTop: 8,
    paddingRight: 12
  },
  listUrlItems: {
    height: "54%",
    marginTop: 8,
    paddingRight: 12
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
  logoSubTitle: {
    fontSize: 12,
    marginBottom: 16,
    fontWeight: "normal",
    color: NEUTRAL_60
  },
  logoSubTitleTablet: {
    fontSize: 12,
    fontWeight: "normal",
    color: NEUTRAL_60,
    paddingBottom: 8
  },
  findingImageContainer: {
    justifyContent: "center",
    alignItems: "center"
  },
  logoImage: {
    resizeMode: "contain",
    marginBottom: 16
  },
  logoImageTablet: {
    width: "100%"
  },
  languageContainer: {
    marginVertical: 24,
    marginHorizontal: 20,
    fontFamily: "Inter-SemiBold"
  },
  languageContainerTablet: {
    width: "33%",
    paddingLeft: 20,
    marginVertical: 0
  },
  debugText: {
    fontFamily: "Inter-SemiBold",
    color: NEUTRAL_60,
    fontSize: 12,
    lineHeight: 18,
    paddingBottom: 8
  },
  debugContainerTablet: {
    width: "100%",
    borderTopWidth: 0
  },
  debugContainer: {
    paddingVertical: 24,
    marginHorizontal: 20,
    fontFamily: "Inter-SemiBold",
    borderTopWidth: 1,
    borderTopColor: NEUTRAL_30
  },
  saveButtonContainer: {
    alignSelf: "flex-start",
    marginTop: 16
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
    fontFamily: "Inter-SemiBold",
    color: NEUTRAL_80,
    fontSize: 18,
    lineHeight: 18,
    fontWeight: "500"
  },
  urlListed: {
    fontFamily: "Inter-SemiBold",
    color: NEUTRAL_80,
    fontSize: 14,
    lineHeight: 14,
    fontWeight: "500"
  },
  urlItem: {
    width: "100%",
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 11,
    borderWidth: 1,
    border: PRIMARY_100,
    backgroundColor: NEUTRAL_100,
    marginVertical: 4
  },
  urlItemBackgroundFilled: {
    backgroundColor: TERCIARY_100
  },
  urlItemContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginLeft: 16,
    height: "100%"
  },
  urlItemContainerElem: {
    marginHorizontal: 8,
    width: "65%"
  },
  urlItemContainerElemTablet: {
    marginHorizontal: 8,
    width: "75%"
  },
  actionIcon: {
    marginHorizontal: 20,
    width: 25,
    height: 25
  },
  iconImage: {
    width: 20,
    height: 20
  },
  containerClose: {
    backgroundColor: PRIMARY_100,
    height: 50,
    width: 50,
    right: "-93%",
    top: -20,
    zIndex: 900,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: -40
  },
  containerCloseTablet: {
    backgroundColor: PRIMARY_100,
    height: 50,
    width: 50,
    right: -515,
    top: -50,
    zIndex: 900,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: -40
  },
  buttonClose: {
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "100%"
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
    marginLeft: 32
  }
});

export default styles;
