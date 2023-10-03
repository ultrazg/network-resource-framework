import { render } from '@testing-library/react';

import MapCover from './map-cover';

describe('MapCover', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<MapCover />);
    expect(baseElement).toBeTruthy();
  });
});
