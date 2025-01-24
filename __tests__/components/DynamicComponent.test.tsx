import React from 'react';
import { render, act } from '@testing-library/react-native';
import DynamicComponent from '../../src/components/DynamicComponent';
import { fetchComponent, getBasePathContext } from "../../src/utils";

jest.mock('../../src/utils', () => ({
  fetchComponent: jest.fn(),
  getBasePathContext: jest.fn()
}));

jest.mock('../../src/components/LoadingScreen', () => 'LoadingScreen');

beforeAll(() => {
  jest.spyOn(console, 'info').mockImplementation(() => {});
});

afterAll(() => {
  jest.restoreAllMocks();
});

describe('DynamicComponent', () => {
  const defaultProps = {
    __id: 'test-id',
    url: 'https://test.com',
    isDemoTry: false,
    isDev: false,
    navigationContainer: {},
    children: null
  };

  beforeEach(() => {
    jest.clearAllMocks();
    getBasePathContext.mockReturnValue('/context');
  });

  it('shows LoadingScreen while loading', () => {
    const MockComponent = () => null;
    fetchComponent.mockResolvedValue({ default: MockComponent });

    const { UNSAFE_getByType } = render(<DynamicComponent {...defaultProps} />);
    expect(UNSAFE_getByType('LoadingScreen')).toBeTruthy();
  });

  it('calls fetchComponent with correct parameters', () => {
    const MockComponent = () => null;
    fetchComponent.mockResolvedValue({ default: MockComponent });

    render(<DynamicComponent {...defaultProps} />);

    expect(fetchComponent).toHaveBeenCalledWith(
      'test-id',
      'https://test.com/context',
      defaultProps.navigationContainer
    );
  });

  it('updates component when key props change', async () => {
    const MockComponent = () => null;
    fetchComponent.mockResolvedValue({ default: MockComponent });

    const { rerender, unmount } = render(<DynamicComponent {...defaultProps} />);

    await act(async () => {
      rerender(<DynamicComponent {...defaultProps} __id="new-id" />);
    });

    expect(fetchComponent).toHaveBeenCalledTimes(2);
    unmount();
  });

  it('passes props correctly to loaded component', async () => {
    const MockComponent = jest.fn(() => null);
    fetchComponent.mockResolvedValue({ default: MockComponent });

    const { unmount } = render(<DynamicComponent {...defaultProps} testProp="test" />);

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(MockComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        testProp: 'test',
        url: 'https://test.com'
      }),
      {}
    );

    unmount();
  });
});
