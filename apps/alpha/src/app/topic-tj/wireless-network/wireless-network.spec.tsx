import { render } from '@testing-library/react';

import WirelessNetwork from './wireless-network';

describe('WirelessNetwork', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<WirelessNetwork />);
    expect(baseElement).toBeTruthy();
  });
});
