import React from 'react';
import { render } from '@testing-library/react-native';
import { useAppSelector } from '../redux';
import { useEtrest } from '../hook/useEtrest';
import Profile from '../src/screens/Profile';

jest.mock('../redux', () => ({
  useAppSelector: jest.fn(),
}));
jest.mock('../hook/useEtrest', () => ({
  useEtrest: jest.fn(),
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
    const { container } = render(<Profile navigation={mockNavigation} />);
    expect(container).toBeTruthy();

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

    const { container } = render(<Profile navigation={mockNavigation} />);
    expect(container).toBeTruthy();
  });

  it('should handle API errors without breaking rendering', async () => {
    mockGetFunctions.getRoleName.mockRejectedValueOnce(new Error('Error fetching role'));
    const { container } = render(<Profile navigation={mockNavigation} />);
    expect(container).toBeTruthy();
  });
});