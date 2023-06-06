import React from "react";
import { ScrollView } from "react-native";
import { Snackbar } from "react-native-paper";
import locale from "../i18n/locale";

const OUTPUT_PARAM = "mobile_json";
const OUTPUT_REFERENCE_ID = "34380BB3AD5446EBB41540FE956C0F66";
const OB_IDENTIFIER_KEY = "$_identifier";

export interface ProcessDialogState {
  data?: object;
  submits?: any;
  processSnackbarVisible?: boolean;
  processSnackbarMessage?: string;
  processSnackbarAction?: any;
  processSnackbarDuration?: number;
  processSnackbarOnDismiss?: any;
}

export default class ProcessDialog<
  S extends ProcessDialogState
> extends React.Component<S> {
  static OUTPUT_PARAM = OUTPUT_PARAM;
  static OUTPUT_REFERENCE_ID = OUTPUT_REFERENCE_ID;
  static OB_IDENTIFIER_KEY = OB_IDENTIFIER_KEY;

  constructor(props) {
    super(props);

    let paramMap = {
      data: null,
      submits: {},
      processSnackbarVisible: false,
      processSnackbarAction: {
        label: locale.t("DismissSnackBar")
      },
      processSnackbarDuration: Snackbar.DURATION_MEDIUM,
      processSnackbarMessage: ""
    };
    this.state = paramMap;
  }

  render() {
    return <ScrollView></ScrollView>;
  }
}
