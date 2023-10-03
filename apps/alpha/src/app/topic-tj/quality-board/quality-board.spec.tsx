import { render } from '@testing-library/react';

import QualityBoard from './quality-board';

describe('QualityBoard', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<QualityBoard />);
    expect(baseElement).toBeTruthy();
  });
});
