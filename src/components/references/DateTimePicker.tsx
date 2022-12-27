import React from "react";
import Modal, { ModalProps, ModalState } from "./Modal";
import RNDateTimePicker, {
  Event
} from "@react-native-community/datetimepicker";
import locale from "../../i18n/locale";
import FormContext from "../../contexts/FormContext";
import { Platform, View } from "react-native";
import { References } from "../../constants/References";

const DATE_TIME_REF = "DateTime";
export type modeType = "date" | "time"; // | "datetime" | "countdown";

export interface DateTimePickerProps extends ModalProps {
  dateMode?: modeType;
  referenceKey?: string;
  valueKey?: string;
  field: any;
  onChangeDateTime?: any;
}

interface State extends ModalState {
  currentDateTime: Date;
  currentDate: Date;
}

export default class DateTimePicker extends Modal<DateTimePickerProps, State> {
  static contextType = FormContext;

  constructor(props: DateTimePickerProps) {
    super(props);

    const now = new Date();
    const initialState: State = {
      currentDate: props.value ? locale.parseISODate(props.value) : null,
      showPickerModal: false,
      loading: false,
      currentDateTime: null
    };

    if (props.dateMode === "time" && props.value) {
      // RNDateTimePicker needs a full date, but time references only store HH:mm:ss
      const strNow = locale.formatDate(now, locale.getUIDateFormat("Date"));
      // construct something like 2020-01-01 13:13:13
      initialState.currentDateTime = locale.parseISODate(
        strNow + " " + props.value
      );
    }

    this.state = initialState;
  }

  getValue = () => {
    if (this.props.dateMode === "time") {
      return this.state.currentDateTime;
    } else {
      return this.state.currentDate;
    }
  };

  formatForOutput = (date: Date) => {
    return locale.formatDate(
      date,
      locale.getServerDateFormat(this.props.referenceKey)
    );
  };

  renderLabel = () => {
    return this.getValue()
      ? this.renderDate(this.getValue())
      : locale.t("Reference:Select");
  };

  renderDate = (date: Date) => {
    return locale.formatDate(
      date,
      locale.getUIDateFormat(this.props.referenceKey)
    );
  };

  onShow = () => {
    if (!this.props.value) {
      if (this.props.dateMode === "time") {
        this.setState({ currentDateTime: new Date() });
      } else {
        this.setState({ currentDate: new Date() });
      }
    }
  };

  onHide = (canceled?: boolean) => {
    if (canceled) {
      return;
    }
    const currentDate = this.getValue();
    const outputDate = currentDate || new Date();
    this.context.onChangeDateTime(
      this.props.field,
      this.formatForOutput(outputDate),
      this.props.valueKey
    );
  };

  onChange = (event: Event, date?: Date): void => {
    if (Platform.OS === "ios") {
      this.setState({ currentDate: date || new Date() });
    } else {
      if (event && event.type === "set") {
        this.setState(
          { currentDate: date || new Date(), showPickerModal: false },
          this.onHide
        );
      } else {
        this.setState({ showPickerModal: false }, () => this.onHide(true));
      }
    }
  };

  renderDialogContent = () => {
    return (
      <View>
        {this.state.showPickerModal && (
          <RNDateTimePicker
            key={this.props.field.id}
            is24Hour // Android only
            mode={this.props.dateMode}
            onChange={this.onChange}
            display="spinner"
            value={this.state.currentDate || new Date()}
          />
        )}
        {this.state.showPickerModal &&
          this.props.referenceKey === References.DateTime && (
            <RNDateTimePicker
              key={`tp-${this.props.field.id}`}
              is24Hour // Android only
              mode="time"
              onChange={this.onChange}
              display="spinner"
              value={
                this.getValue()
                  ? locale.parseISODate(this.getValue())
                  : new Date()
              }
            />
          )}
      </View>
    );
  };
}
