import { fetchComponent } from '../../src/utils';

const mockShow = jest.fn();
jest.mock('etendo-ui-library/dist-native/components/alert/AlertManager', () => ({
  show: (...args: any[]) => mockShow(...args),
  setAlertDefaultDuration: jest.fn(),
}));
jest.mock('../../src/components/packages', () => ({}));
jest.mock('../../hook/isTablet', () => ({ isTablet: () => false }));
jest.mock('react-native-orientation-locker', () => ({}));
jest.mock('@react-native-community/netinfo', () => ({}));
jest.mock('../../src/i18n/locale', () => ({ t: (k: string) => k }));

describe('fetchComponent', () => {
  const navigation = { navigate: jest.fn() };
  const fetchMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (global as any).fetch = fetchMock;
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  const expectHandledFailure = async () => {
    await expect(fetchComponent('id', 'http://x', navigation)).rejects.toBeDefined();
    expect(navigation.navigate).toHaveBeenCalledWith('Home');
    expect(mockShow).toHaveBeenCalledWith('LoginScreen:NetworkError', 'error');
  };

  it('rejects and notifies when there is no connection', async () => {
    fetchMock.mockRejectedValue(new TypeError('Network request failed'));
    await expectHandledFailure();
  });

  it('rejects and notifies on an HTTP error', async () => {
    fetchMock.mockResolvedValue({ ok: false });
    await expectHandledFailure();
  });

  it('rejects and notifies on an empty body', async () => {
    fetchMock.mockResolvedValue({ ok: true, text: async () => '  ' });
    await expectHandledFailure();
  });

  it('downloads the bundle only once on success', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      text: async () => 'module.exports = { default: 1 };',
    });
    const result: any = await fetchComponent('id', 'http://x', navigation);
    expect(result.default).toBe(1);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(navigation.navigate).not.toHaveBeenCalled();
  });
});
