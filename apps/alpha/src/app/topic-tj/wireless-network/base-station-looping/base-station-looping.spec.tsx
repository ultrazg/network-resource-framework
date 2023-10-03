import { render } from '@testing-library/react';

import BaseStationLooping from './base-station-looping';

describe('BaseStationLooping', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<BaseStationLooping />);
    expect(baseElement).toBeTruthy();
  });
});
