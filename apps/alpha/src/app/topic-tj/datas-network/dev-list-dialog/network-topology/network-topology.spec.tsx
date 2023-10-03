import { render } from '@testing-library/react';

import NetworkTopology from './network-topology';

describe('NetworkTopology', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<NetworkTopology />);
    expect(baseElement).toBeTruthy();
  });
});
