import { render } from '@testing-library/react';

import NetworkElementList from './network-element-list';

describe('NetworkElementList', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<NetworkElementList />);
    expect(baseElement).toBeTruthy();
  });
});
