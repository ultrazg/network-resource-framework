import { render } from '@testing-library/react';

import RightDetailsView from './right-details-view';

describe('RightDetailsView', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<RightDetailsView />);
    expect(baseElement).toBeTruthy();
  });
});
