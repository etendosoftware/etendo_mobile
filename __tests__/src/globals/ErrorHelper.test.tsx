import { ErrorHelper } from "../../../src/globals";
import { ERROR_TYPE } from "../../../src/globals/ErrorHelper";
import locale from "../../../src/i18n/locale";

describe('ErrorHelper', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('responseReport', () => {
    it('should capture exception and return error', () => {
      const mockError = {
        response: {
          config: {
            url: 'https://etendo.com/api',
            params: { q: 'test' }
          }
        }
      };

      const result = ErrorHelper.responseReport('CREATE_CRITERIA', mockError);

      expect(result).toBe(mockError);
    });
  });

  describe('handleError', () => {
    it('should handle a 500 error response and report it', () => {
      const mockError = {
        response: {
          status: 500,
          config: {
            url: 'https://example.com/api'
          },
          data: {}
        }
      };
      jest.spyOn(console, 'error').mockImplementation(() => { });
      jest.spyOn(ErrorHelper, 'responseReport').mockImplementation(() => { });

      const result = ErrorHelper.handleError(ERROR_TYPE.SAVE, mockError);

      expect(ErrorHelper.responseReport).toHaveBeenCalledWith(ERROR_TYPE.SAVE, mockError);
      expect(result).toBe(true);
    });

    it('should handle an error on save with missing required values', () => {
      const mockError = { message: 'Failing row contains some invalid values' };
      jest.spyOn(locale, 't').mockReturnValue('Missing required values');

      const result = ErrorHelper.handleError(ERROR_TYPE.SAVE, mockError);

      expect(mockError.message).toBe('Missing required values');
      expect(result).toBe(false);
    });

    it('should log unhandled errors', () => {
      const mockError = new Error('Unhandled error');
      jest.spyOn(console, 'error').mockImplementation(() => { });

      const result = ErrorHelper.handleError(ERROR_TYPE.REMOVE, mockError);

      expect(console.error).toHaveBeenCalledWith('Unhandled error', mockError);
      expect(result).toBe(false);
    });
  });
});
