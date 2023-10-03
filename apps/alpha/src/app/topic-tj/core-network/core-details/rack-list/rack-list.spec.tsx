import { render } from '@testing-library/react';

import RackList from './rack-list';

describe('RackList', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<RackList />);
    expect(baseElement).toBeTruthy();
  });
});
