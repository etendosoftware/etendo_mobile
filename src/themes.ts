import { configureFonts, DefaultTheme } from "react-native-paper";
import { Theme } from "react-native-paper/lib/typescript/types";
import { Platform, StyleSheet } from "react-native";

const fontConfig = {
  ios: {
    regular: {
      fontFamily: "poppins"
    },
    medium: {
      fontFamily: "poppins-medium"
    },
    light: {
      fontFamily: "poppins-light"
    },
    thin: {
      fontFamily: "poppins-thin"
    }
  },
  android: {
    regular: {
      fontFamily: "poppins"
    },
    medium: {
      fontFamily: "poppins-medium"
    },
    light: {
      fontFamily: "poppins-light"
    },
    thin: {
      fontFamily: "poppins-thin"
    }
  }
};


interface AppDefaultTheme extends Theme {
  colors: {
    primary: string;
    background: string;
    surface: string;
    accent: string;
    error: string;
    text: string;
    onSurface: string;
    disabled: string;
    placeholder: string;
    backdrop: string;
    notification: string;
    greyborders: string,
    greybackgroundSecondary: string,
    backgroundSecondary: string,
    success: string,
    textSecondary: string,
    greyaccent: string
  };
}

export const defaultTheme: AppDefaultTheme = {
  ...DefaultTheme,
  roundness: 5,
  colors: {
    ...DefaultTheme.colors,
    primary: "#202452",
    accent: "#fad614",
    background: "#ffffff",
    backgroundSecondary: "#f2f2f2",
    error: "#ff012f",
    success: "#b0ff0c",
    text: "#000000",
    textSecondary: "#383838",
    surface: "#ffffff",
    onSurface: "#000000",
    greyaccent: "#999999",
    greybackgroundSecondary: "#e2e2e2",
    greyborders: "#cccccc"
  }
};

export interface ITheme {
  theme: ReactNativePaper.Theme;
}

export const componentsStyle = StyleSheet.create<{
  inputText;
  inputLabel;
  subheading;
  formBody;
  modalCallButton;
  modalCallLabel;
  fieldContainer;
  bottomToolbar;
}>({
  inputText: {
    borderColor: defaultTheme.colors.greyborders,
    borderWidth: 1,
    borderRadius: 3,
    marginTop: 2,
    marginBottom: 2,
    paddingLeft: 2,
    paddingRight: 2,
    paddingTop: 1,
    paddingBottom: 1,
    backgroundColor: defaultTheme.colors.background,
    height: 45,
    fontSize: 15
  },
  inputLabel: {
    fontSize: 15,
    color: defaultTheme.colors.text
  },
  subheading: {
    fontWeight: "bold",
    color: defaultTheme.colors.primary,
    textAlignVertical: "center"
  },
  formBody: {
    padding: 10,
    margin: 15,
    flexGrow: 1
  },
  modalCallButton: {
    backgroundColor: defaultTheme.colors.background,
    textTransform: "none",
    borderRadius: 5,
    padding: 7,
    color: defaultTheme.colors.primary
  },
  modalCallLabel: {
    textAlign: "left",
    textAlignVertical: "center",
    paddingRight: 5,
    color: defaultTheme.colors.text
  },
  fieldContainer: {
    flexDirection: "row",
    marginBottom: 8,
    paddingBottom: 8,
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: defaultTheme.colors.greybackgroundSecondary
  },

  bottomToolbar: {
    backgroundColor: defaultTheme.colors.primary,
    padding: 8,
    paddingBottom: Platform.OS === "ios" ? 20 : 12,
    flexDirection: "row",
    shadowColor: defaultTheme.colors.text,
    shadowOffset: {
      width: 5,
      height: 5
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 100,
    elevation: 5,
    height: 84
  }
});
