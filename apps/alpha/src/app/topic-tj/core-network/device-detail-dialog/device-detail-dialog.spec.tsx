import { render } from '@testing-library/react';

import DeviceDetailDialog from './device-detail-dialog';

describe('DeviceDetailDialog', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DeviceDetailDialog />);
    expect(baseElement).toBeTruthy();
  });
});
