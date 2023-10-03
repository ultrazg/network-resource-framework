import { render } from '@testing-library/react';

import CoreNetwork from './core-network';

describe('CoreNetwork', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<CoreNetwork />);
    expect(baseElement).toBeTruthy();
  });
});
