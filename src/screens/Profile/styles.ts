import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  backgroundMobile: {
    width: "100%",
    height: "50%",
    position: "absolute",
    top: "70%",
    zIndex: -1
  },
  backgroundTablet: {
    width: "70%",
    height: "100%",
    position: "absolute",
    top: "70%",
    left: "0%",
    zIndex: -1
  },
  containerMobile: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "auto"
  },
  containerTablet: {
    flexDirection: "row-reverse",
    justifyContent: "center",
    alignItems: "center",
    top: "5%"
  }
});

export default styles;
