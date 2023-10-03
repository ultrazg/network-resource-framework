import { render } from '@testing-library/react';

import PointList from './point-list';

describe('PointList', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<PointList />);
    expect(baseElement).toBeTruthy();
  });
});
