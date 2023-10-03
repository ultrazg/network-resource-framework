import { render } from '@testing-library/react';

import DeviceList from './device-list';

describe('DeviceList', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DeviceList />);
    expect(baseElement).toBeTruthy();
  });
});
