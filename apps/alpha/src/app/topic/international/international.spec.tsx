import { render } from '@testing-library/react';

import International from './international';

describe('International', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<International />);
    expect(baseElement).toBeTruthy();
  });
});
