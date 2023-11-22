import { StyleProp, ViewStyle } from "react-native";

export type Field = {
  id: string;
  name: string;
  readOnly: boolean;
  column: {
    mandatory?: boolean;
    reference?: any;
    updatable?: boolean;
  };
  textInputStyle?: StyleProp<ViewStyle>;
  columnName: string;
  [key: string]: any;
};

export type Fields = {
  [key: string]: Field;
};
