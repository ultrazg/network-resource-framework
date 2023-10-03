import { render } from '@testing-library/react';

import BaseStationEquit from './base-station-equit';

describe('BaseStationEquit', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<BaseStationEquit />);
    expect(baseElement).toBeTruthy();
  });
});
