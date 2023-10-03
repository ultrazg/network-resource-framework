import { render } from '@testing-library/react';

import MapView from './map-view';

describe('MapView', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<MapView />);
    expect(baseElement).toBeTruthy();
  });
});
