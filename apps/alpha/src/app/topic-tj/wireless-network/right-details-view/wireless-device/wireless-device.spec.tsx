import { render } from '@testing-library/react';

import WirelessDevice from './wireless-device';

describe('WirelessDevice', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<WirelessDevice />);
    expect(baseElement).toBeTruthy();
  });
});
