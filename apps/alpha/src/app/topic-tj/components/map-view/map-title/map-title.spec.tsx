import { render } from '@testing-library/react';

import MapTitle from './map-title';

describe('MapWindow', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<MapTitle />);
    expect(baseElement).toBeTruthy();
  });
});
