import { StyleSheet } from "react-native";
import { QUATERNARY_100, TERCIARY_100 } from "../../styles/colors";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 80,
    height: 120,
    width: 120,
    borderRadius: 100,
    backgroundColor: TERCIARY_100,
    overflow: "hidden"
  },
  image: {
    height: 120,
    width: 120,
    borderRadius: 100
  },
  text: {
    color: QUATERNARY_100,
    fontSize: 55,
    lineHeight: 62
  }
});
