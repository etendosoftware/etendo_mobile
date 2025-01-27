import { supportedLocales, formatLanguageUnderscore, getLanguageName, languageByDefault } from '../../src/i18n/config';

jest.mock('../../src/lang/enUS.json', () => ({
  key: 'English Value'
}));

jest.mock('../../src/lang/esES.json', () => ({
  key: 'Spanish Value'
}));

describe('Config Module', () => {
  describe('supportedLocales', () => {
    it('should have correct locales structure', () => {
      expect(supportedLocales['en-US']).toBeDefined();
      expect(supportedLocales['es-ES']).toBeDefined();
      expect(supportedLocales['en-US'].name).toBe('English (USA)');
      expect(supportedLocales['es-ES'].name).toBe('Spanish (Spain)');
    });

    it('should load correct translations', () => {
      const enTranslations = supportedLocales['en-US'].loadTranslations();
      const esTranslations = supportedLocales['es-ES'].loadTranslations();
      
      expect(enTranslations.key).toBe('English Value');
      expect(esTranslations.key).toBe('Spanish Value');
    });
  });

  describe('formatLanguageUnderscore', () => {
    const testCases = [
      { input: 'en', withDash: true, expected: 'en-US' },
      { input: 'en', withDash: false, expected: 'en_US' },
      { input: 'en-US', withDash: true, expected: 'en-US' },
      { input: 'en_US', withDash: false, expected: 'en_US' },
      { input: 'es', withDash: true, expected: 'es-ES' },
      { input: 'es', withDash: false, expected: 'es_ES' },
      { input: 'invalid', withDash: true, expected: 'en-US' },
      { input: '', withDash: true, expected: 'en-US' }
    ];

    testCases.forEach(({ input, withDash, expected }) => {
      it(`should format "${input}" correctly with dash=${withDash}`, () => {
        expect(formatLanguageUnderscore(input, withDash)).toBe(expected);
      });
    });
  });

  describe('getLanguageName', () => {
    it('should return correct language names', () => {
      expect(getLanguageName('en-US')).toBe('English (USA)');
      expect(getLanguageName('es-ES')).toBe('Spanish (Spain)');
      expect(getLanguageName('en')).toBe('English (USA)');
      expect(getLanguageName('es')).toBe('Spanish (Spain)');
    });

    it('should return default language name for unsupported languages', () => {
      expect(getLanguageName('fr')).toBe('English (USA)');
      expect(getLanguageName('invalid')).toBe('English (USA)');
    });
  });

  describe('languageByDefault', () => {
    it('should return default language format', () => {
      expect(languageByDefault()).toBe('en-US');
    });
  });
});
