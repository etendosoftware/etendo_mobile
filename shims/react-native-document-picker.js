/**
 * Compatibility shim: maps the react-native-document-picker v9 API
 * to @react-native-documents/picker v12.
 *
 * Required because etendo-ui-library hardcodes require('react-native-document-picker').
 */
const {
  pick,
  pickDirectory,
  types,
  errorCodes,
  isErrorWithCode,
  releaseSecureAccess,
  releaseLongTermAccess,
} = require('@react-native-documents/picker');

const isCancel = (error) =>
  isErrorWithCode(error) && error.code === errorCodes.OPERATION_CANCELED;

const isInProgress = (error) =>
  isErrorWithCode(error) && error.code === errorCodes.IN_PROGRESS;

const DocumentPicker = {
  pick,
  pickDirectory,
  types,
  isCancel,
  isInProgress,
  releaseSecureAccess,
  releaseLongTermAccess,
};

module.exports = DocumentPicker;
module.exports.default = DocumentPicker;
