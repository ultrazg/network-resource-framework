import { render } from '@testing-library/react';

import DeviceInfo from './device-info';

describe('DeviceInfo', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DeviceInfo />);
    expect(baseElement).toBeTruthy();
  });
});
