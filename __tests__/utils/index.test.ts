import {
  fetchComponent,
  deviceOrientation,
  internetIsAvailable,
  getBasePathContext,
  generateUniqueId,
  getContextPathFromUrl,
  getHostAndPortFromUrl
} from '../../src/utils/index';

import { isTablet } from '../../hook/isTablet';
import Orientation from 'react-native-orientation-locker';
import NetInfo from '@react-native-community/netinfo';
import { References } from '../../src/constants/References';
import { show } from 'etendo-ui-library/dist-native/components/alert/AlertManager';

jest.mock('../../hook/isTablet');
jest.mock('react-native-orientation-locker', () => ({
  lockToLandscape: jest.fn(),
  lockToPortrait: jest.fn()
}));
jest.mock('@react-native-community/netinfo', () => ({
  fetch: jest.fn()
}));
jest.mock('etendo-ui-library/dist-native/components/alert/AlertManager');
jest.mock('../../src/i18n/locale', () => ({
  t: jest.fn((key) => key)
}));

describe('fetchComponent', () => {
  const mockNavigation = {
    navigate: jest.fn()
  };

  beforeEach(() => {
    global.fetch = jest.fn();
    jest.clearAllMocks();
  });

  it('should fetch and parse component successfully', async () => {
    const mockCode = 'module.exports = { test: true }';
    (global.fetch as jest.Mock)
      .mockImplementationOnce(() => Promise.resolve({ ok: true }))
      .mockImplementationOnce(() => Promise.resolve({
        ok: true,
        text: () => Promise.resolve(mockCode)
      }));

    const result = await fetchComponent('testId', 'http://test.com', mockNavigation);
    expect(result).not.toBe(mockNavigation.navigate);
    expect(typeof result).toBe('object');
  });

  it('should handle network error and navigate to home', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() => Promise.reject(new Error('Network error')));

    const result = await fetchComponent('testId', 'http://test.com', mockNavigation);
    result();

    expect(mockNavigation.navigate).toHaveBeenCalledWith('Home');
    expect(show).toHaveBeenCalledWith('LoginScreen:NetworkError', 'error');
  });

  it('should handle empty response and navigate to home', async () => {
    (global.fetch as jest.Mock)
      .mockImplementationOnce(() => Promise.resolve({ ok: true }))
      .mockImplementationOnce(() => Promise.resolve({
        ok: true,
        text: () => Promise.resolve('')
      }));

    const result = await fetchComponent('testId', 'http://test.com', mockNavigation);
    result();

    expect(mockNavigation.navigate).toHaveBeenCalledWith('Home');
  });

  it('should handle invalid JavaScript code gracefully', async () => {
    (global.fetch as jest.Mock)
      .mockImplementationOnce(() => Promise.resolve({ ok: true }))
      .mockImplementationOnce(() => Promise.resolve({
        ok: true,
        text: () => Promise.resolve('invalid JS code')
      }));

    const result = await fetchComponent('testId', 'http://test.com', mockNavigation);
    result();

    expect(mockNavigation.navigate).toHaveBeenCalledWith('Home');
  });
});

describe('deviceOrientation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should lock to landscape for tablet', () => {
    (isTablet as jest.Mock).mockReturnValue(true);
    deviceOrientation();
    expect(Orientation.lockToLandscape).toHaveBeenCalled();
    expect(Orientation.lockToPortrait).not.toHaveBeenCalled();
  });

  it('should lock to portrait for non-tablet', () => {
    (isTablet as jest.Mock).mockReturnValue(false);
    deviceOrientation();
    expect(Orientation.lockToPortrait).toHaveBeenCalled();
    expect(Orientation.lockToLandscape).not.toHaveBeenCalled();
  });
});

describe('internetIsAvailable', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return true when internet is connected', async () => {
    NetInfo.fetch.mockResolvedValue({ isConnected: true });
    const result = await internetIsAvailable();
    expect(result).toBe(true);
  });

  it('should return false when internet is not connected', async () => {
    NetInfo.fetch.mockResolvedValue({ isConnected: false });
    const result = await internetIsAvailable();
    expect(result).toBe(false);
  });
});

describe('getBasePathContext', () => {
  it('should return EtendoContextPath for demo mode', () => {
    const result = getBasePathContext(true, false);
    expect(result).toBe(References.EtendoContextPath);
  });

  it('should return SubappContextPath for dev environment', () => {
    const result = getBasePathContext(false, true);
    expect(result).toBe(References.SubappContextPath);
  });

  it('should return custom context path for production', () => {
    const result = getBasePathContext(false, false, '/custom-path');
    expect(result).toBe('/custom-path');
  });
});

describe('generateUniqueId', () => {
  it('should generate unique IDs consistently', () => {
    const name = 'test';
    const id1 = generateUniqueId(name);
    const id2 = generateUniqueId(name);
    expect(id1).toMatch(/^test_[a-z0-9]{9}$/);
    expect(id2).toMatch(/^test_[a-z0-9]{9}$/);
    expect(id1).not.toBe(id2);
  });

  it('should handle empty names gracefully', () => {
    const id = generateUniqueId('');
    expect(id).toMatch(/^_[a-z0-9]{9}$/);
  });

  it('should work with long names', () => {
    const name = 'thisIsAVeryLongComponentName';
    const id = generateUniqueId(name);
    expect(id.startsWith('thisIsAVeryLongComponentName_')).toBe(true);
  });
});

describe('getContextPathFromUrl', () => {
  it('should extract context path correctly', () => {
    const url = 'https://example.com:8080/context/path?query=123';
    expect(getContextPathFromUrl(url)).toBe('/context/path');
  });

  it('should return empty string when no context path exists', () => {
    const url = 'https://example.com';
    expect(getContextPathFromUrl(url)).toBe('');
  });

  it('should return empty string for invalid URLs', () => {
    expect(getContextPathFromUrl('invalid-url')).toBe('');
  });
});

describe('getHostAndPortFromUrl', () => {
  it('should extract host and port correctly', () => {
    const url = 'https://example.com:8080/context/path?query=123';
    expect(getHostAndPortFromUrl(url)).toBe('https://example.com:8080');
  });

  it('should return only host if no port is specified', () => {
    const url = 'https://example.com/context/path';
    expect(getHostAndPortFromUrl(url)).toBe('https://example.com');
  });

  it('should handle invalid URLs gracefully', () => {
    expect(getHostAndPortFromUrl('invalid-url')).toBe('');
  });

  it('should handle URLs with query parameters correctly', () => {
    const url = 'https://example.com:3000/path?test=123';
    expect(getHostAndPortFromUrl(url)).toBe('https://example.com:3000');
  });
});