import { render } from '@testing-library/react';

import SignalDedicatedLine from './signal-dedicated-line';

describe('SignalDedicatedLine', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<SignalDedicatedLine />);
    expect(baseElement).toBeTruthy();
  });
});
