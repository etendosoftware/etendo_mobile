import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeModules, Platform } from 'react-native';
import {
  getLanguages,
  loadLanguage,
  languageDefault,
  changeLanguage,
  formatObjectLanguage,
  getSupportedLanguages,
  languageCurrentInitialize
} from '../../src/helpers/getLanguajes';
import locale from '../../src/i18n/locale';
import Languages from '../../src/ob-api/objects/Languages';
import { supportedLocales } from '../../src/i18n/config';

// Configuración correcta de los mocks
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn()
}));

jest.mock('../../src/i18n/locale', () => ({
  setCurrentLanguage: jest.fn(),
  init: jest.fn()
}));

jest.mock('../../src/ob-api/objects/Languages', () => ({
  getLanguages: jest.fn()
}));

describe('Language Management Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset Platform.OS mock
    Object.defineProperty(Platform, 'OS', { get: () => 'ios' });
  });

  describe('getLanguages', () => {
    beforeEach(() => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('en_US');
    });

    it('should return default language when server languages are empty', async () => {
      (Languages.getLanguages as jest.Mock).mockResolvedValue([]);
      const result = await getLanguages();
      expect(result.list.length).toBe(1);
      expect(result.isCurrentInlist).toBe(false);
    });

    it('should return intersection of server and supported languages', async () => {
      const mockServerLanguages = [
        { id: '1', language: 'en_US', name: 'English' },
        { id: '2', language: 'es_ES', name: 'Spanish' }
      ];
      (Languages.getLanguages as jest.Mock).mockResolvedValue(mockServerLanguages);
      const result = await getLanguages();
      expect(result.list.length).toBeGreaterThan(0);
    });
  });

  describe('loadLanguage', () => {
    it('should load language from AsyncStorage', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('en_US');
      const result = await loadLanguage();
      expect(result).toBe('en_US');
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('selectedLanguage');
    });
  });

  describe('languageDefault', () => {
    it('should use stored language if available', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('es_ES');
      const result = await languageDefault();
      expect(result).toBe('es_ES');
      expect(locale.setCurrentLanguage).toHaveBeenCalled();
    });

    it('should use device language if no stored language', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      NativeModules.SettingsManager = {
        settings: { AppleLocale: 'en_US' }
      };
      const result = await languageDefault();
      expect(result).toBe('en-US');
    });
  });

  describe('changeLanguage', () => {
    it('should update language settings', async () => {
      await changeLanguage('fr_FR');
      expect(locale.setCurrentLanguage).toHaveBeenCalledWith('fr_FR');
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('selectedLanguage', 'fr_FR');
    });
  });

  describe('formatObjectLanguage', () => {
    it('should format language object correctly', () => {
      const result = formatObjectLanguage('en_US');
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('value');
      expect(result).toHaveProperty('label');
    });
  });

  describe('getSupportedLanguages', () => {
    it('should return array of supported languages', () => {
      const result = getSupportedLanguages();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(Object.keys(supportedLocales).length);
    });
  });

  describe('languageCurrentInitialize', () => {
    it('should get and set current language', () => {
      languageCurrentInitialize.set('it_IT');
      expect(languageCurrentInitialize.get()).toBe('it_IT');
    });
  });
});
