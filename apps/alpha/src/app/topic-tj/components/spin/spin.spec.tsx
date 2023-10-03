import { render } from '@testing-library/react';

import Spin from './spin';

describe('Spin', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Spin />);
    expect(baseElement).toBeTruthy();
  });
});
