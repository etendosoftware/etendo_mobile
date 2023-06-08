import { Dimensions, StyleSheet } from "react-native";
import { defaultTheme } from "../../themes";
import { GREY_BLUE, NEUTRAL_60, PRIMARY_100, WHITE } from "../../styles/colors";

const win = Dimensions.get("window");

const styles = StyleSheet.create({
  containerMobile: {
    paddingHorizontal: 30,
    paddingVertical: 50,
    backgroundColor: defaultTheme.colors.background,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    top: -160,
    height: "60%"
  },
  etendoLogotypeMobile: {
    resizeMode: "contain",
    width: 90,
    height: 90,
    alignSelf: "center",
    top: -100,
    flex: 1
  },
  credentialsTextMobile: {
    color: NEUTRAL_60,
    fontSize: 14,
    fontWeight: "500",
    top: -50,
    paddingRight: 25,
    paddingLeft: 25,
    display: "flex",
    alignSelf: "stretch",
    fontFamily: "Inter",
    alignItems: "center",
    textAlign: "center"
  },
  containerTablet: {
    position: "absolute",
    display: "flex",
    alignSelf: "center",
    justifyContent: "center",
    backgroundColor: defaultTheme.colors.background,
    borderRadius: 20
  },
  generalContainerTablet: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: WHITE,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  generalContainerMobile: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: WHITE
  },
  backgroundLoginImageContainer: {
    position: "relative",
    width: "100%"
  },
  backgroundHeaderImage: {
    position: "relative",
    width: "100%",
    height: "90%",
    bottom: "auto"
  },
  backgroundLoginImage: {
    width: "100%",
    height: "100%",
    resizeMode: "stretch"
  },
  settingsText: {
    fontFamily: "Inter-Regular",
    fontWeight: "600",
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    left: -5
  },
  buttonsDemoSettings: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 40,
    marginTop: 40,
    justifyContent: "space-between"
  },
  buttonsDemoSettingsTablet: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 80,
    left: -10,
    top: 25,
    justifyContent: "space-between"
  },
  settingsImageContainer: {
    display: "flex",
    fontFamily: "Inter-Regular",
    height: 30,
    width: 130,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "space-between",
    top: -45,
    flexDirection: "row"
  },
  settingsImage: {
    display: "flex",
    resizeMode: "contain",
    height: 24,
    width: 24,
    left: -10,
    tintColor: defaultTheme.colors.primary,
    alignSelf: "center",
    justifyContent: "flex-start"
  },
  etendoLogotypeTablet: {
    resizeMode: "contain",
    width: 70,
    height: 70,
    alignSelf: "center",
    top: -90,
    flex: 1
  },
  credentialsTextTablet: {
    color: NEUTRAL_60,
    fontSize: 14,
    textAlign: "center",
    fontWeight: "500"
  },
  welcomeTitleContainer: {
    flexDirection: "row",
    alignSelf: "center",
    top: -100
  },
  welcomeTitle: {
    color: PRIMARY_100,
    fontWeight: "700",
    fontSize: 30
  },
  starsImage: {
    position: "absolute",
    resizeMode: "contain",
    right: 0,
    width: 27,
    height: 27,
    marginRight: -30
  },

  generalView: {
    flex: 1,
    flexDirection: "column",
    paddingBottom: 16
  },
  viewStyle: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    height: "100%"
  },
  appbarStyle: {
    paddingTop: 28,
    paddingLeft: 8
  },
  containerLogo: {
    height: "15%"
  },
  logo: {
    flex: 1,
    alignSelf: "stretch",
    width: win.width,
    height: win.height
  },
  containerInputs: {
    display: "flex",
    flexDirection: "column",
    alignContent: "center",
    top: -20
  },
  buttonDemo: {
    flexDirection: "row",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    top: -55,
    fontFamily: "Inter-Regular"
  },
  textInputsHolders: {
    fontFamily: "Inter-Regular",
    fontStyle: "normal",
    fontSize: 14,
    lineHeight: 22,
    color: GREY_BLUE,
    paddingLeft: 5
  },
  textInputStyle: {
    justifyContent: "flex-end",
    height: 45,
    paddingVertical: 0,
    marginBottom: 20,
    marginTop: 20,
    width: "100%"
  },
  textInputIconStyle: {
    paddingTop: 10
  },
  buttonLogin: {
    height: 45,
    paddingVertical: 0,
    fontSize: 1
  },
  copyRightStyle: {
    paddingTop: 50
  },
  containerCopyright: {
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-end"
  },
  copyrightStyle: {
    textAlign: "center",
    color: defaultTheme.colors.primary,
    fontSize: 14,
    backgroundColor: defaultTheme.colors.background
  },
  picker: {
    height: 44,
    borderColor: defaultTheme.colors.primary,
    borderWidth: 1
  },
  pickerItem: {
    height: 44
  }
});

export default styles;
