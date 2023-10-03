import { render } from '@testing-library/react';

import MapPlugin from './map-plugin';

describe('MapPlugin', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<MapPlugin />);
    expect(baseElement).toBeTruthy();
  });
});
