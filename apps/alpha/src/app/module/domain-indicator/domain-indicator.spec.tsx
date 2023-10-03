import { render } from '@testing-library/react';

import DomainIndicator from './domain-indicator';

describe('DomainIndicator', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DomainIndicator />);
    expect(baseElement).toBeTruthy();
  });
});
