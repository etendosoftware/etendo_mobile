import { StyleSheet, Platform, StatusBar } from "react-native";
import { defaultTheme } from "../../themes";
import { isTablet } from "../../../hook/isTablet";
import { PRIMARY_100 } from "../../styles/colors";

const styles = StyleSheet.create({
  container: {
    backgroundColor: defaultTheme.colors.background,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
  },
  imgBackground: {
    height: "100%"
  },
  image: {
    height: 350,
    width: "100%",
    right: 0,
    bottom: 0,
    position: "absolute"
  },
  imageMobile: {
    height: 342,
    width: 328,
    right: 0,
    bottom: 0,
    position: "absolute"
  },
  logo: {
    height: "100%",
    width: 130
  },
  etendo: {
    height: 50,
    width: 200
  },
  etendoContainer: {
    height: "100%",
    width: isTablet() ? 260 : 220,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column"
  },
  text: {
    color: defaultTheme.colors.textSecondary,
    fontSize: 20,
    alignSelf: "flex-end",
    paddingRight: isTablet() ? 40 : 20
  },

  conteinerSup: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    height: 80,
    alignItems: "center",
    marginTop: 20
  },
  conteinerMed: {
    display: "flex",
    width: "100%",
    flexDirection: "row",
    height: "8%",
    marginTop: 20
  },
  conteinerInf: {
    display: "flex",
    width: "100%",
    flexDirection: "row",
    height: "80%"
  },
  button: {
    width: "50%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  buttonFaq: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
    marginLeft: "62%",
    marginTop: Platform.OS === "ios" ? "10%" : "25%"
  },
  TextIcon: {
    color: defaultTheme.colors.textSecondary
  },
  welcomeMobile: {
    marginHorizontal: 24,
    marginTop: 48
  },
  welcomeText: {
    color: PRIMARY_100,
    fontWeight: "500",
    fontSize: 28,
    lineHeight: 36
  },
  welcomeName: {
    color: PRIMARY_100,
    fontWeight: "700",
    fontSize: 45,
    lineHeight: 53
  }
});

export default styles;
