import locale from "../i18n/locale";

const ERROR_TYPE = {
  CREATE_CRITERIA: "CREATE_CRITERIA",
  REMOVE: "REMOVE",
  REMOVE_LIST: "REMOVE_LIST",
  SAVE: "SAVE",
  DEFAULT_VALUES: "DEFAULT_VALUES",
  SELECTOR_FETCH: "SELECTOR_FETCH"
};

class ErrorHelper {
  static logDevResponse(response) {
    console.log("RSQL Parse", response.config);
    console.log("RSQL Parse", response.data);
    console.log("RSQL Parse", response.headers);
    console.log("RSQL Parse", response.status);
  }

  static handleSaveError(error) {
    console.info("Error on save", error.message);
    if (error.message && error.message.indexOf("Failing row contains") > -1) {
      error.message = locale.t("Tab:RSQL_MissingRequiredValues");
    }
  }

  static responseReport = (eventName, error) => {
    const response = error.response;
    const eventData = {
      url: response.config.url
    };
    if (response.config.q) {
      eventData["q"] = response.config.params.q;
    }

    return error;
  
  };
  
  static handleError = (type, error) => {
    let handled = false;
    try {
      if (error.response) {
        const response = error.response;
        if (response?.status === 500) {
          if (__DEV__) {
            ErrorHelper.logDevResponse(response);
          }
          let message = null;
          switch (type) {
            default:
              console.error('Error type miss message localization', type);
          }
          if (message != null) {
            error.message = message;
          }
          ErrorHelper.responseReport(type, error);
          handled = true;
        }
      } else {
        switch (type) {
          case ERROR_TYPE.SAVE:
            ErrorHelper.handleSaveError(error);
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
