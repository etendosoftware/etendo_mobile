import { Platform, StyleSheet } from "react-native";
import { defaultTheme } from "../../themes";

const styles = StyleSheet.create({
  viewStyle: {
    flexDirection: "row",
    flexGrow: 0,
    flexShrink: 0,
    width: "100%",
    justifyContent: "space-between",
    backgroundColor: defaultTheme.colors.background,
    height: 45,
    borderColor: defaultTheme.colors.greyborders,
    borderWidth: 1,
    borderRadius: 3,
    marginBottom: 10
  },
  textStyle: {
    marginLeft: 10,
    flexGrow: 1,
    flexShrink: 1,
    marginTop: Platform.OS === "ios" ? 10 : 0,
    fontSize: 15,
    width: "80%",
    alignSelf: "flex-start"
  },
  textSelectStyle: {
    marginLeft: 10,
    flexGrow: 1,
    color: defaultTheme.colors.greyaccent,
    marginTop: Platform.OS === "ios" ? 10 : 0,
    fontSize: 15
  },
  viewToStyle: {
    marginRight: 10,
    alignContent: "center",
    alignItems: "center",
    flexDirection: "row",
    flexGrow: 0,
    backgroundColor: defaultTheme.colors.background
  },
  iconViewStyle: {
    flexDirection: "row",
    alignContent: "center"
  },
  iconStyle: {
    flexShrink: 1,
    textAlignVertical: "center",
    paddingLeft: 5,
    paddingRight: 5,
    color: defaultTheme.colors.primary,
    fontSize: 20
  },
  textIconStyle: {
    flexShrink: 1,
    paddingRight: 5
  }
});

export default styles;
