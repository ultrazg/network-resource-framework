import { render } from '@testing-library/react';

import Transmission from './transmission';

describe('Transmission', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Transmission />);
    expect(baseElement).toBeTruthy();
  });
});
