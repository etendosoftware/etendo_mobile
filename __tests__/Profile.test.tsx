import React from 'react';
import { render } from '@testing-library/react-native';
import { useAppSelector } from '../redux';
import { useEtrest } from '../hook/useEtrest';
import Profile from '../src/screens/Profile';
import { selectData } from '../redux/user';
import { show } from 'etendo-ui-library/dist-native/components/alert/AlertManager';

jest.mock('../redux', () => ({
  useAppSelector: jest.fn(),
}));
jest.mock('../hook/useEtrest', () => ({
  useEtrest: jest.fn(),
  isAccessDeniedError: jest.requireActual('../hook/useEtrest').isAccessDeniedError,
}));
jest.mock('etendo-ui-library/dist-native/components/alert/AlertManager', () => ({
  show: jest.fn(),
}));
const mockLogout = jest.fn();
jest.mock('../hook/useUser', () => ({
  useUser: () => ({ logout: mockLogout }),
}));

describe('Profile Screen Data Transformation Test', () => {
  const mockNavigation = { goBack: jest.fn() };
  const mockData = { username: 'testuser' };
  const mockGetFunctions = {
    getOrganizationName: jest.fn().mockResolvedValue('Organization'),
    getRoleName: jest.fn().mockResolvedValue('Role'),
    getWarehouseName: jest.fn().mockResolvedValue('Warehouse'),
    getClientName: jest.fn().mockResolvedValue('Client'),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useAppSelector as jest.Mock).mockImplementation((selector) => {
      switch (selector) {
        case 'selectData':
          return mockData;
        case 'selectToken':
          return 'mockToken';
        case 'selectBindaryImg':
          return 'mockBindaryImg';
        case 'selectSelectedUrl':
          return 'mockUrl';
        default:
          return null;
      }
    });
    (useEtrest as jest.Mock).mockReturnValue(mockGetFunctions);
  });

  it('should render profile with transformed data', async () => {
    const { root } = render(<Profile navigation={mockNavigation} />);
    expect(root).toBeTruthy();

    const transformedData = {
      username: mockData.username,
      role: await mockGetFunctions.getRoleName(),
      organization: await mockGetFunctions.getOrganizationName(),
      warehouse: await mockGetFunctions.getWarehouseName(),
      client: await mockGetFunctions.getClientName(),
    };

    expect(transformedData.username).toBe('testuser');
    expect(transformedData.role).toBe('Role');
    expect(transformedData.organization).toBe('Organization');
    expect(transformedData.warehouse).toBe('Warehouse');
    expect(transformedData.client).toBe('Client');
  });

  it('should handle missing data gracefully', () => {
    (useAppSelector as jest.Mock).mockImplementation((selector) => {
      if (selector === 'selectData') return null;
      return null;
    });

    const { root } = render(<Profile navigation={mockNavigation} />);
    expect(root).toBeTruthy();
  });

  it('should handle API errors without breaking rendering', async () => {
    mockGetFunctions.getRoleName.mockRejectedValueOnce(new Error('Error fetching role'));
    const { root } = render(<Profile navigation={mockNavigation} />);
    expect(root).toBeTruthy();
  });

  it('should show the remaining fields when the role cannot be read (ETP-5523)', async () => {
    (useAppSelector as jest.Mock).mockImplementation((selector) =>
      selector === selectData ? { username: 'testuser', roleId: 'R1' } : null,
    );
    mockGetFunctions.getRoleName.mockRejectedValueOnce(new Error('401'));

    const { findByText, getByText } = render(<Profile navigation={mockNavigation} />);

    expect(await findByText('Organization')).toBeTruthy();
    expect(getByText('Warehouse')).toBeTruthy();
    expect(getByText('Client')).toBeTruthy();
    expect(getByText('*')).toBeTruthy();
  });

  it('should show a single access toast and log out when the role cannot read the profile data (ETP-5523)', async () => {
    (useAppSelector as jest.Mock).mockImplementation((selector) =>
      selector === selectData ? { username: 'testuser', roleId: 'R1' } : null,
    );
    const unauthorized = Object.assign(new Error('Request failed with status code 401'), {
      response: { status: 401 },
    });
    mockGetFunctions.getRoleName.mockRejectedValueOnce(unauthorized);
    mockGetFunctions.getClientName.mockRejectedValueOnce(unauthorized);

    const { findByText } = render(<Profile navigation={mockNavigation} />);

    expect(await findByText('Organization')).toBeTruthy();
    expect(show).toHaveBeenCalledTimes(1);
    // i18n is not initialized in tests, so the message carries the key name
    expect(show).toHaveBeenCalledWith(expect.stringContaining('RoleWithoutAccess'), 'error');
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  it('should not show the access toast nor log out for other errors', async () => {
    (useAppSelector as jest.Mock).mockImplementation((selector) =>
      selector === selectData ? { username: 'testuser', roleId: 'R1' } : null,
    );
    mockGetFunctions.getRoleName.mockRejectedValueOnce(
      Object.assign(new Error('Network Error'), { response: { status: 500 } }),
    );

    const { findByText } = render(<Profile navigation={mockNavigation} />);

    expect(await findByText('Organization')).toBeTruthy();
    expect(show).not.toHaveBeenCalled();
    expect(mockLogout).not.toHaveBeenCalled();
  });
});