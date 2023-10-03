import { render } from '@testing-library/react';

import MapSelect from './map-select';

describe('MapSelect', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<MapSelect />);
    expect(baseElement).toBeTruthy();
  });
});
