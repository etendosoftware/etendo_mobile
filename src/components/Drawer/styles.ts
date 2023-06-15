import { StyleSheet } from "react-native";
import { defaultTheme } from "../../themes";

const styles = StyleSheet.create({
  image: {
    flex: 1,
    alignSelf: "stretch",
    width: "100%",
    height: 150,
    position: "relative"
  },
  topData: {
    position: "absolute",
    padding: 5,
    width: "100%",
    height: "50%",
    alignContent: "center",
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-evenly",
    marginTop: 10
  },
  pressableStyle: {
    marginTop: 30,
    width: 85
  },
  dataProfile: {
    width: "50%",
    height: "30%"
  },
  textProfile: {
    fontWeight: "bold",
    color: defaultTheme.colors.textSecondary,
    fontSize: 15
  },
  constantItems: {
    borderStyle: "solid",
    borderColor: defaultTheme.colors.textSecondary,
    borderTopWidth: 0.5,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10
  },
  constantItemsSecondary: {
    borderStyle: "solid",
    borderColor: defaultTheme.colors.textSecondary,
    borderBottomWidth: 0.5,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10
  },
  viewPlaceholder: {
    margin: 20
  },
  drawerItemsContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10
  },
  drawerItem: {
    width: "80%"
  },
  iconColor: {
    color: defaultTheme.colors.textSecondary
  },
  drawerText: {
    color: defaultTheme.colors.textSecondary,
    fontSize: 15
  }
});

export default styles;
