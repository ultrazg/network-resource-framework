import { render } from '@testing-library/react';

import CoreDetailDialog from './core-detail-dialog';

describe('CoreDetailDialog', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<CoreDetailDialog />);
    expect(baseElement).toBeTruthy();
  });
});
