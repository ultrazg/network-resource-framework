import { render } from '@testing-library/react';

import Broadband from './broadband';

describe('Broadband', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Broadband />);
    expect(baseElement).toBeTruthy();
  });
});
