import { StyleSheet } from "react-native";
import { defaultTheme } from "../../themes";

const styles = StyleSheet.create({
  subheadingStyle: {
    width: "100%",
    color: defaultTheme.colors.text
  },
  switchStyle: {
    flexDirection: "row",
    justifyContent: "flex-end"
  },
  chipStyle: {
    marginRight: 8
  }
});

export default styles;
