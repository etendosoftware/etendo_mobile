import React from "react";
import { Platform, ScrollView, Text, View, Dimensions } from "react-native";
import { Appbar } from "react-native-paper";
import { ProcessDialog, ScanDialog } from "../components";
import { INavigation } from "../components/Card";
import MainAppContext from "../contexts/MainAppContext";
import locale from "../i18n/locale";
import OBProcess from "../ob-api/classes/OBProcess";
import Windows from "../stores/Windows";
import { FabAction } from "../types/FabAction";
import withAuthentication from "../withAuthentication";
import { Snackbar } from "../globals";

const SCAN_QTY_KEY_TYPE = Platform.OS === "ios" ? "done" : "next";
const win = Dimensions.get("window");

interface Props {
  route?: any;
  navigation?: INavigation;
}

interface State {
  showScanDialog: boolean;
  showProcessMenu: boolean;
  showProcessDialog: string | boolean;
  showFAB: boolean;
  processLoading: boolean;
  fabActions: any[];
}

export interface ProcessDialogRouteParams {
  windowId: any;
  level: any;
  process: any;
  tabRoutes: any;
  selectedRecordId: any;
  recordId: any;
  selectedRecordContext: any;
  parentRecordContext: any;
  selectedRecordsIds: string[];
}

class ProcessDialogScreen extends React.Component<Props, State> {
  static contextType = MainAppContext;

  constructor(props) {
    super(props);
  }

  getWindowId() {
    return this.props.route.params.windowId;
  }

  getTabIndex(defaultValue = null) {
    return this.props.route.params.tabIndex || defaultValue;
  }

  getParams() {
    return this.props.route.params as ProcessDialogRouteParams;
  }

  componentDidMount = () => {};

  setFABActions = tab => {
    const tabProcesses = Windows.getTabProcesses(tab);
    const fabActions: FabAction[] = tabProcesses.map(tabProcess => {
      return {
        key: tabProcess.id,
        icon: "check",
        label: tabProcess.name,
        process: tabProcess,
        onPress: tabProcess => {
          this.props.navigation.push("ProcessDialog", {});
        }
      };
    });
    this.setState({ fabActions });
  };

  renderMenuItems = () => {
    return this.renderProcessDialog(this.getParams().process, false);
  };

  renderProcessDialog = (processDef, isFAB) => {
    const {
      recordId,
      selectedRecordId,
      selectedRecordContext,
      parentRecordContext
    } = this.getParams();
    return (
      <View key={processDef.id} style={{ height: win.height, width: "100%" }}>
        {processDef.smfmuScan === true ? (
          <ScanDialog
            key={"scandialog-" + processDef.id}
            hideDialog={() => this.props.navigation.goBack()}
            process={processDef}
            recordId={isFAB ? selectedRecordId : recordId}
            context={isFAB ? selectedRecordContext : parentRecordContext}
            doProcess={this.callProcess}
            isFAB={isFAB}
            qtyReturnKeyType={SCAN_QTY_KEY_TYPE}
            selectedRecordsIds={this.getParams().selectedRecordsIds}
          />
        ) : (
          <ProcessDialog
            key={"dialog-" + processDef.id}
            hideDialog={() => {
              this.setState({
                showProcessDialog: false,
                showProcessMenu: false,
                showFAB: isFAB
              });
              this.props.navigation.goBack();
            }}
            process={processDef}
            recordId={isFAB ? selectedRecordId : recordId}
            context={isFAB ? selectedRecordContext : parentRecordContext}
            doProcess={this.callProcess}
            qtyReturnKeyType={SCAN_QTY_KEY_TYPE}
            isFAB={isFAB}
            loading={false}
            okDisabled={false}
            onDone={() => this.props.navigation.goBack()}
            selectedRecordsIds={this.getParams().selectedRecordsIds}
          />
        )}
      </View>
    );
  };

  callProcess = async (processDef, parameters, comesFromFAB, data) => {
    const dataParam = parameters.find(
      p => p.referenceSearchKey === ProcessDialog.OUTPUT_REFERENCE_ID
    );
    let response = null;

    const processCaller = new OBProcess(
      processDef.name,
      processDef.id,
      processDef.javaClassName,
      this.getWindowId()
    );
    let request;

    if (data && dataParam) {
      request = {
        _params: {
          recordId: this.getParams().selectedRecordsIds[0],
          [dataParam.dBColumnName]: data
        }
      };
    } else if (data) {
      request = data;
    } else {
      if (processDef.isMultiRecord) {
        request = {
          recordIds: this.getParams().selectedRecordsIds
        };
      } else {
        // TODO: should set as entity primary key column?
        request = {
          recordId: this.getParams().selectedRecordsIds[0]
        };
      }
    }

    try {
      this.setState({ processLoading: true });
      response = await processCaller.callProcess(request);
      this.setState({ showProcessDialog: false, showScanDialog: false });
      if (response.message && response.message.severity) {
        Snackbar.showError(response.message.text);
      } else if (response.response && response.response.error) {
        Snackbar.showError(response.response.error.message);
      } else if (response.responseActions) {
        const messageAction = response.responseActions.find(action =>
          action.hasOwnProperty("showMsgInView")
        );
        if (messageAction) {
          Snackbar.showError(messageAction.showMsgInView.msgText);
        }
      } else {
        Snackbar.showMessage(response.message, 10000);
        // refresh view
        this.props.navigation.goBack();
      }
    } catch (error) {
      Snackbar.showError(error.message);
    } finally {
      this.setState({ processLoading: false });
    }
  };

  render = () => {
    return (
      <View style={{ flex: 1, height: win.height }}>
        <Appbar.Header dark={true}>
          <Appbar.BackAction onPress={() => this.props.navigation.goBack()} />
          <Appbar.Content
            title={locale.t("Process:Run", {
              processName: this.getParams().process.name
            })}
          />
        </Appbar.Header>
        {this.renderMenuItems()}
      </View>
    );
  };
}

export default withAuthentication(ProcessDialogScreen);
