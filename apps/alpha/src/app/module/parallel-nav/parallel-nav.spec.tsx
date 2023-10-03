import { render } from '@testing-library/react';

import ParallelNav from './parallel-nav';

describe('ParallelNav', () => {
  it('should render successfully', () => {
    // @ts-ignore
    const { baseElement } = render(<ParallelNav />);
    expect(baseElement).toBeTruthy();
  });
});
