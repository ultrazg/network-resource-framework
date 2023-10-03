import { render } from '@testing-library/react';

import DescList from './desc-list';

describe('DescList', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DescList />);
    expect(baseElement).toBeTruthy();
  });
});
