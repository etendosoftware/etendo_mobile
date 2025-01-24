import locale from '../../src/i18n/locale';
import i18n from 'i18n-js';
import { enUS } from 'date-fns';
import { References } from '../../src/constants/References';

jest.mock('i18n-js', () => ({
  locale: 'en-US',
  fallbacks: false,
  translations: {},
  t: jest.fn((key, params) => key),
}));

const mockLocalization = {
  locale: 'en-US'
};

jest.mock('../../src/i18n/config.ts', () => ({
  supportedLocales: {
    'en-US': {
      loadTranslations: () => ({
        test: 'Test',
        nested: { key: 'Nested Value' }
      })
    },
    'es-ES': {
      loadTranslations: () => ({
        test: 'Prueba',
        nested: { key: 'Valor Anidado' }
      })
    }
  }
}));

describe('Locale Module', () => {
  beforeEach(() => {
    jest.resetModules();
    mockLocalization.locale = 'en-US';
    i18n.translations = {};
    i18n.locale = 'en-US';
    locale.currentDateLocale = null;
    locale.init();
  });

  describe('Initialization and Configuration', () => {
    it('should initialize with default locale and translations', () => {
      expect(i18n.locale).toBe('en-US');
      expect(i18n.translations['en-US']).toBeDefined();
    });

    it('should handle initTranslation separately', () => {
      i18n.translations = {};
      locale.initTranslation();
      expect(i18n.translations['en-US']).toBeDefined();
    });
  });

  describe('Translation Functions', () => {
    it('should translate keys correctly', () => {
      i18n.translations['en-US'] = {
        test: 'Test',
        nested: { key: 'Nested Value' }
      };
      expect(locale.t('test')).toBe('test');
      expect(locale.t('nested.key')).toBe('nested.key');
    });

    it('should handle translation with parameters', () => {
      i18n.translations['en-US'] = {
        paramTest: 'Hello %{name}'
      };
      expect(locale.t('paramTest', { name: 'World' })).toBe('paramTest');
    });
  });

  describe('Language Management', () => {
    it('should change language and update translations', () => {
      locale.setCurrentLanguage('es-ES');
      expect(i18n.locale).toBe('es-ES');
    });

    it('should handle underscore format in setCurrentLanguage', () => {
      locale.setCurrentLanguage('es_ES');
      expect(i18n.locale).toBe('es-ES');
    });

    it('should set locale directly with setLocal', () => {
      locale.setLocal('es_ES');
      expect(i18n.locale).toBe('es-ES');
    });
  });

  describe('Date Handling', () => {
    it('should format dates correctly', () => {
      const testDate = new Date(2023, 0, 1);
      expect(locale.formatDate(testDate, 'yyyy-MM-dd')).toBe('2023-01-01');
    });

    it('should handle date formatting errors', () => {
      expect(() => locale.formatDate('invalid', 'yyyy-MM-dd')).toThrow();
    });

    it('should parse ISO dates correctly', () => {
      const dateStr = '2023-01-01';
      const parsed = locale.parseISODate(dateStr);
      expect(parsed).toBeInstanceOf(Date);
      expect(parsed.getFullYear()).toBe(2023);
    });
  });

  describe('Date Format Functions', () => {
    it('should return correct server date formats', () => {
      expect(locale.getServerDateFormat(References.Time)).toBe('HH:mm:ss');
      expect(locale.getServerDateFormat(References.Date)).toBe('yyyy-MM-dd');
      expect(locale.getServerDateFormat(References.DateTime)).toBe("yyyy-MM-dd'T'HH:mm:ssxxx");
    });

    it('should return correct UI date formats', () => {
      expect(locale.getUIDateFormat(References.Time)).toBe('HH:mm');
      expect(locale.getUIDateFormat(References.Date)).toBe('yyyy-MM-dd');
      expect(locale.getUIDateFormat(References.DateTime)).toBe('yyyy-MM-dd HH:mm:ss');
    });
  });

  describe('Locale Detection', () => {
    it('should return correct device locale', () => {
      mockLocalization.locale = 'en-US';
      expect(locale.getDeviceLocale()).toBe('en-US');
    });

    it('should return fallback locale for unsupported language', () => {
      mockLocalization.locale = 'fr-FR';
      const result = locale.getDeviceLocale();
      expect(result).toBe('en-US');
    });

    it('should return correct date locale', () => {
      expect(locale.getDeviceLocaleForDate()).toBe(enUS);
    });
  });
});
