import { Platform, StyleSheet } from "react-native";
import { defaultTheme } from "../../themes";
import { GREY_40, PRIMARY_100, WHITE } from "../../styles/colors";

const styles = StyleSheet.create({
  viewStyle: {
    flexDirection: "row",
    flexGrow: 0,
    flexShrink: 0,
    width: "100%",
    justifyContent: "space-between",
    backgroundColor: WHITE,
    height: 45,
    borderColor: PRIMARY_100,
    borderWidth: 2,
    borderRadius: 5,
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
    color: GREY_40,
    marginTop: Platform.OS === "ios" ? 10 : 0,
    fontSize: 15
  },
  viewToStyle: {
    marginRight: 10,
    alignContent: "center",
    alignItems: "center",
    flexDirection: "row",
    flexGrow: 0,
    backgroundColor: WHITE
  },
  iconViewStyle: {
    flexDirection: "row",
    alignContent: "center"
  },
  iconStyle: {
    flexShrink: 1,
    textAlignVertical: "center",
    paddingLeft: 15,
    paddingRight: 5,
    color: PRIMARY_100,
    fontSize: 20,
    width: 8,
    height: 8
  },
  textIconStyle: {
    flexShrink: 1,
    paddingRight: 5
  }
});

export default styles;
