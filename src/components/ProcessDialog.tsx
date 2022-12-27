import React from "react";
import { View, ScrollView, Text, StyleSheet } from "react-native";
import { Card, TextInput, Snackbar, Button, FAB } from "react-native-paper";
import FormContext from "../contexts/FormContext";
import locale from "../i18n/locale";
import { IOBDalEntity } from "../ob-api/classes/OBDal";
import { Field } from "../types";
import { defaultTheme } from "../themes";
import { INavigation } from "./Card";

const OUTPUT_PARAM = "mobile_json";
const OUTPUT_REFERENCE_ID = "34380BB3AD5446EBB41540FE956C0F66";
const OB_IDENTIFIER_KEY = "$_identifier";

export interface ProcessDialogProps {
  process: any;
  qtyReturnKeyType?: any;
  hideDialog: any;
  doProcess: any;
  visible: boolean;
  isFAB: boolean;
  cancelDisabled?: boolean;
  loading: any;
  okDisabled?: boolean;
  entity: IOBDalEntity;
  recordId: string;
  context: any;
  onDone: any;
  selectedRecordsIds: any;
  navigation?: INavigation;
}

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
  P extends ProcessDialogProps,
  S extends ProcessDialogState
> extends React.Component<P, S> {
  static OUTPUT_PARAM = OUTPUT_PARAM;
  static OUTPUT_REFERENCE_ID = OUTPUT_REFERENCE_ID;
  static OB_IDENTIFIER_KEY = OB_IDENTIFIER_KEY;

  inputs: object;
  preRenderDialogContent: any = null;
  postRenderDialogContent: any = null;

  constructor(props) {
    super(props);

    let paramMap = {
      data: null,
      submits: {},
      processSnackbarVisible: false,
      processSnackbarOnDismiss: this.onDismissSnackbar,
      processSnackbarAction: {
        label: locale.t("DismissSnackBar"),
        onPress: this.onDismissSnackbar
      },
      processSnackbarDuration: Snackbar.DURATION_MEDIUM,
      processSnackbarMessage: ""
    };
    this.props.process.parameters.forEach(parameter => {
      paramMap[parameter.dBColumnName] = null;
    });
    // @ts-ignore
    this.state = paramMap;
    this.inputs = {};
  }

  changeInput = (
    field: Field,
    value: string,
    key: string,
    identifier?: string
  ) => {
    const newState = {};
    newState[field.dBColumnName] = value;
    if (identifier) {
      newState[`${field.dBColumnName}$_identifier`] = identifier;
    }
    this.setState(newState);
  };

  renderDialogContent() {
    return this.props.process.parameters.map(parameter => {
      if (parameter.referenceSearchKey === OUTPUT_REFERENCE_ID) {
        // Do not render the paramater we use to send the data
        return null;
      }

      switch (parameter["referenceSearchKey"]) {
        // Here we would support reference search keys for process paramaters
        default:
          switch (parameter[`reference${OB_IDENTIFIER_KEY}`]) {
            case "String":
              return (
                <TextInput
                  key={parameter.id}
                  style={{
                    marginBottom: 8
                  }}
                  allowFontScaling={false}
                  mode="outlined"
                  dense
                  label={parameter.name}
                  ref={input => {
                    this.inputs[parameter.dBColumnName] = input;
                  }}
                  onChangeText={input => {
                    this.changeInput(input, parameter.dBColumnName);
                  }}
                  value={this.state[parameter.dBColumnName]}
                ></TextInput>
              );
            case "Quantity":

            case "Number":
              return (
                <TextInput
                  key={parameter.id}
                  style={{
                    marginBottom: 8
                  }}
                  allowFontScaling={false}
                  mode="outlined"
                  dense
                  label={parameter.name}
                  ref={input => {
                    this.inputs[parameter.dBColumnName] = input;
                  }}
                  onChangeText={input => {
                    this.changeInput(input, parameter.dBColumnName);
                  }}
                  value={
                    this.state[parameter.dBColumnName]
                      ? this.state[parameter.dBColumnName].toString()
                      : null
                  }
                  keyboardType={"decimal-pad"}
                  returnKeyType={this.props.qtyReturnKeyType || "done"}
                ></TextInput>
              );
            default:
              return null; // Not supported
          }
      }
    });
  }

  showSnackbar = (
    processSnackbarMessage,
    action = this.onDismissSnackbar,
    actionLabel = locale.t("DismissSnackBar"),
    processSnackbarDuration = Snackbar.DURATION_MEDIUM
  ) => {
    const processSnackbarAction = {
      label: actionLabel,
      onPress: action
    };

    this.setState({
      processSnackbarVisible: true,
      processSnackbarMessage,
      processSnackbarAction,
      processSnackbarDuration
    });
  };

  onDismiss = () => {
    this.props.hideDialog();
  };

  onDismissSnackbar = () => {
    this.setState({ processSnackbarVisible: false });
  };

  onCancelPressed = () => {
    this.props.hideDialog();
  };

  onDonePressed = () => {
    this.defaultOnDonePressed().then(() => this.props.onDone());
  };

  defaultOnDonePressed = async () => {
    await this.props.doProcess(
      this.props.process,
      this.props.process.parameters,
      this.props.isFAB,
      this.state.data
    );
  };

  getTitle = () => {
    return this.props.process.name;
  };
  getContext = () => {
    return this.props.context;
  };
  render() {
    return (
      <ScrollView>
        <View style={{ width: "100%", height: "100%" }}>
          <View
            style={{
              backgroundColor: defaultTheme.colors.background,
              alignItems: "center"
            }}
          >
            <FormContext.Provider
              value={{
                getRecordContext: this.getContext,
                onChangeInput: this.changeInput,
                onChangeSelectorItem: this.changeInput
              }}
            >
              {this.renderDialogContent()}
            </FormContext.Provider>
          </View>
          <FAB
            style={styles.secondaryFab}
            small={false}
            icon="content-save"
            onPress={this.onDonePressed}
          />
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  secondaryFab: {
    position: "absolute",
    margin: 16,
    top: 5,
    right: 10,
    backgroundColor: defaultTheme.colors.primary,
    fontSize: 30
  }
});
