import locale from "../i18n/locale";
import * as Sentry from "@sentry/react-native";

const ERROR_TYPE = {
  CREATE_CRITERIA: "CREATE_CRITERIA",
  REMOVE: "REMOVE",
  REMOVE_LIST: "REMOVE_LIST",
  SAVE: "SAVE",
  DEFAULT_VALUES: "DEFAULT_VALUES",
  SELECTOR_FETCH: "SELECTOR_FETCH"
};

class ErrorHelper {
  static responseReport = (eventName, error) => {
    const response = error.response;
    const eventData = {
      url: response.config.url
    };
    if (response.config.q) {
      eventData["q"] = response.config.params.q;
    }
    const scope = new Sentry.Scope();
    scope.setTag("rsql", true);
    scope.setTag("ERROR_TYPE", eventName);
    scope.setTag("url", response.config.url);
    if (response.config.q) {
      scope.setTag("q", response.config.params.q);
    }
    Sentry.captureException(error, () => scope);
    return error;
  };
  static handleError = (type, error) => {
    var handled = false;
    try {
      if (error.response) {
        const response = error.response;
        if (response) {
          if ((response.status = 500)) {
            if (__DEV__) {
              console.log("RSQL Parse", response.config);
              console.log("RSQL Parse", response.data);
              console.log("RSQL Parse", response.headers);
              console.log("RSQL Parse", response.status);
            }
            var message = null;
            switch (type) {
              case ERROR_TYPE.CREATE_CRITERIA:
                message = locale.t("Tab:RSQL_ParseError");
                break;
              case ERROR_TYPE.REMOVE:
                message = locale.t("Tab:RSQL_RemoveError");
                break;
              case ERROR_TYPE.REMOVE_LIST:
                message = locale.t("Tab:RSQL_RemoveListError");
                break;
              case ERROR_TYPE.SAVE:
                message = locale.t("Tab:RSQL_SaveError");
                break;
              case ERROR_TYPE.DEFAULT_VALUES:
                message = locale.t("Tab:RSQL_DefaultValuesError");
                break;
              case ERROR_TYPE.SELECTOR_FETCH:
                message = locale.t("Selector:RSQL_SelectorFetch");
                break;
              default:
                console.error("Error type miss message localization", type);
            }
            if (message != null) error.message = message;
            ErrorHelper.responseReport(type, error);
            handled = true;
          }
        }
      } else {
        switch (type) {
          case ERROR_TYPE.SAVE:
            console.info("Error on save", error.message);
            if (
              error.message &&
              error.message.indexOf("Failing row contains") > -1
            ) {
              error.message = locale.t("Tab:RSQL_MissingRequiredValues");
            }
            break;
        }
      }
    } catch (e) {
      console.error(e);
    }
    if (!handled) {
      console.error("Unhandled error", error);
    }
    return handled;
  };
}
export { ErrorHelper, ERROR_TYPE };
