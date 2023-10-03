import { render } from '@testing-library/react';

import MetropolitanAreaNetwork from './metropolitan-area-network';

describe('MetropolitanAreaNetwork', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<MetropolitanAreaNetwork />);
    expect(baseElement).toBeTruthy();
  });
});
