import { render } from '@testing-library/react';

import MapWindow from './map-window';

describe('MapWindow', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<MapWindow />);
    expect(baseElement).toBeTruthy();
  });
});
