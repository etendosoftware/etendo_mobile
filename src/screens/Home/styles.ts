import { StyleSheet, Platform } from "react-native";
import { defaultTheme } from "../../themes";
import { isTablet } from "../../../hook/isTablet";

const styles = StyleSheet.create({
  container: {
    backgroundColor: defaultTheme.colors.background,
    height: "100%"
  },
  image: {
    height: 342,
    width: 364,
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
    justifyContent: "center",
    alignItems: "center",
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
  }
});

export default styles;
