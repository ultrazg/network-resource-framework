import { render } from '@testing-library/react';

import LegendView from './legend-view';

describe('LegendView', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<LegendView iconList={[]} />);
    expect(baseElement).toBeTruthy();
  });
});
