import { Dimensions, StyleSheet } from "react-native";
import { defaultTheme } from "../../themes";
import { BLUE, GREY_60, GREY_PURPLE } from "../../styles/colors";

const win = Dimensions.get("window");

const styles = StyleSheet.create({
  containerMobile: {
    flex: 1,
    paddingHorizontal: 30,
    paddingVertical: 50,
    backgroundColor: defaultTheme.colors.background
  },
  etendoLogotypeMobile: {
    resizeMode: "contain",
    width: 90,
    height: 90,
    margin: 0,
    padding: 0,
    alignSelf: "center"
  },
  credentialsTextMobile: {
    color: GREY_PURPLE,
    fontSize: 19.5,
    fontWeight: "500"
  },
  containerTablet: {
    flex: 1,
    backgroundColor: defaultTheme.colors.background
  },
  backgroundLoginImageContainer: {
    position: "relative",
    width: "34.5%"
  },
  backgroundLoginImage: {
    position: "absolute",
    left: 0,
    width: "100%",
    height: "100%"
  },
  settingsImageContainer: {
    position: "absolute",
    height: 40,
    width: 40,
    borderRadius: 8,
    justifyContent: "center"
  },
  settingsImage: {
    resizeMode: "contain",
    height: 24,
    width: 24,
    tintColor: GREY_60,
    alignSelf: "center"
  },
  etendoLogotypeTablet: {
    resizeMode: "contain",
    width: 150,
    height: 40,
    margin: 0,
    padding: 0,
    alignSelf: "flex-start"
  },
  credentialsTextTablet: {
    color: GREY_PURPLE,
    fontSize: 19.5,
    textAlign: "center",
    fontWeight: "500"
  },
  welcomeTitleContainer: {
    flexDirection: "row",
    alignSelf: "center",
    marginTop: 10
  },
  welcomeTitle: {
    color: BLUE,
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
    marginBottom: 0
  },
  buttonDemo: {
    flexDirection: "row",
    justifyContent: "flex-end",
    fontFamily: "Inter-Regular"
  },
  textInputStyle: {
    justifyContent: "center",
    height: 45,
    paddingVertical: 5,
    marginBottom: 20,
    marginTop: 10,
    width: "100%"
  },
  textInputIconStyle: {
    paddingTop: 10
  },
  containerLogin: {
    marginTop: 20,
    marginBottom: 20
  },
  buttonLogin: {
    height: 45,
    paddingVertical: 5,
    fontSize: 1
  },

  containerCopyright: {
    width: "100%",
    alignItems: "center"
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
