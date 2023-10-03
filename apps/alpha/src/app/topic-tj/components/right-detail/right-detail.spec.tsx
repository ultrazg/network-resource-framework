import { render } from '@testing-library/react';

import RightDetail from './right-detail';

describe('RightDetail', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<RightDetail />);
    expect(baseElement).toBeTruthy();
  });
});
