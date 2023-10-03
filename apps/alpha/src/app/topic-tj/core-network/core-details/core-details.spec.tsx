import { render } from '@testing-library/react';

import CoreDetails from './core-details';

describe('CoreDetails', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<CoreDetails />);
    expect(baseElement).toBeTruthy();
  });
});
